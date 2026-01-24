/**
 * Chart Analysis API Client
 * Sends chart images to the backend for AI analysis.
 */

import { supabase } from "./supabase"

function stripOuterQuotes(value: string) {
  const trimmed = value.trim()
  if (trimmed.length >= 2) {
    const first = trimmed[0]
    const last = trimmed[trimmed.length - 1]
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1).trim()
    }
  }
  return trimmed
}

function getApiBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_URL
  const cleaned = stripOuterQuotes(raw ?? '')
  const fallback = 'http://127.0.0.1:8000'
  const base = (cleaned || fallback).replace(/\/+$/, '')
  return base
}

export interface AnalysisResult {
  stock_name: string
  trend: "Uptrend" | "Downtrend" | "Sideways"
  risk: "Low" | "Medium" | "High"
  confidence: number
  explanation: string
}

export interface ScanRecord {
  id: string
  stock_name: string
  trend: "Uptrend" | "Downtrend" | "Sideways"
  risk: "Low" | "Medium" | "High"
  confidence: number
  explanation: string
  user_id: string | null
  created_at: string
}

/**
 * Analyze a stock chart image using the backend AI service.
 * 
 * @param image - The chart image file to analyze
 * @param stockName - Optional stock ticker symbol (e.g., "AAPL")
 * @returns Analysis result with trend, risk, confidence, and explanation
 * @throws Error if the request fails
 */
export async function analyzeChart(
  image: File,
  stockName?: string
): Promise<AnalysisResult> {
  const formData = new FormData()
  formData.append("image", image)
  if (stockName) {
    formData.append("stock_name", stockName)
  }

  const url = `${getApiBaseUrl()}/analyze`
  let response: Response
  try {
    response = await fetch(url, {
      method: "POST",
      body: formData,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    throw new Error(
      `Unable to reach backend API at ${url}. Is the FastAPI server running? (${message})`
    )
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Analysis failed: ${errorText}`)
  }

  return response.json()
}

async function saveScanToSupabaseDetailed(
  result: AnalysisResult,
  userId?: string | null
): Promise<{ data: ScanRecord | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("scans")
      .insert({
        stock_name: result.stock_name,
        trend: result.trend,
        risk: result.risk,
        confidence: result.confidence,
        explanation: result.explanation,
        user_id: userId ?? null,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data: data as ScanRecord, error: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.toLowerCase().includes('failed to fetch')) {
      return {
        data: null,
        error:
          'Network error reaching Supabase (request blocked or offline). Check internet/ad-blockers, and confirm the Supabase project is accessible.'
      }
    }
    return { data: null, error: message }
  }
}

/**
 * Analyze chart and save to Supabase in one call.
 * Returns the analysis result and save status.
 */
export async function analyzeAndSave(
  image: File,
  stockName?: string,
  userId?: string | null
): Promise<{ result: AnalysisResult; saved: boolean; error?: string }> {
  try {
    const result = await analyzeChart(image, stockName)
    const saved = await saveScanToSupabaseDetailed(result, userId)
    return {
      result,
      saved: saved.data !== null,
      error: saved.data === null ? (saved.error ?? "Failed to save to database") : undefined,
    }
  } catch (err) {
    throw err
  }
}

/**
 * Save an analysis result to Supabase.
 * 
 * @param result - The analysis result to save
 * @param userId - Optional user ID (can be null for anonymous scans)
 * @returns The inserted row or null if save failed
 */
export async function saveScanToSupabase(
  result: AnalysisResult,
  userId?: string | null
): Promise<ScanRecord | null> {
  const saved = await saveScanToSupabaseDetailed(result, userId)
  if (!saved.data) {
    console.warn("Supabase save failed:", saved.error ?? 'Unknown error')
  }
  return saved.data
}

/**
 * Fetch the latest scans from Supabase.
 * 
 * @param limit - Maximum number of scans to fetch (default: 10)
 * @returns Array of scan records or empty array on error
 */
export async function fetchLatestScans(limit: number = 10): Promise<ScanRecord[]> {
  try {
    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    return (data as ScanRecord[]) ?? []
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn("Failed to fetch scans:", message)
    throw new Error(message)
  }
}

export async function deleteScan(scanId: string): Promise<{ ok: boolean; error?: string }> {
  if (!scanId) return { ok: false, error: 'Missing scan id' }

  try {
    const { data, error, count } = await supabase
      .from('scans')
      // Ask PostgREST for an exact affected-row count.
      .delete({ count: 'exact' })
      .eq('id', scanId)
      // Request a return payload so we can detect "deleted 0 rows" even if no error is thrown.
      .select('id')

    if (error) return { ok: false, error: error.message }

    const deletedCount = typeof count === 'number' ? count : Array.isArray(data) ? data.length : 0
    if (deletedCount <= 0) {
      return {
        ok: false,
        error:
          'Delete did not remove any rows. This usually means Row Level Security (RLS) or permissions are blocking deletes for the current user/key. Update your Supabase RLS policies (or disable RLS for scans) to allow deletes.'
      }
    }

    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

