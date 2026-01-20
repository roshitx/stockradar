import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StockDetailSkeleton } from "@/components/skeletons/stock-detail-skeleton";

export default function StockDetailLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StockDetailSkeleton />
        </div>
      </main>

      <Footer />
    </div>
  );
}
