import { Topbar } from "@/components/topbar";
import { ProposalForm } from "@/components/proposal-form";
import { ProposalList } from "@/components/proposal-list";
import { ErrorBoundary } from "@/components/error-boundary";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Network State Crowdfunding</h1>
          <p className="text-lg text-gray-600">Community proposals with 1:1 NS matching</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProposalForm />
          </div>
          
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <ProposalList />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}