import ScanDetailPage from '@/components/scan-detail-page'
import Sidebar from '@/components/sidebar'

export default function ScanPage({ params }: { params: { symbol: string } }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar currentPage="scans" onNavigate={() => {}} />
      <ScanDetailPage symbol={params.symbol.toUpperCase()} />
    </div>
  )
}
