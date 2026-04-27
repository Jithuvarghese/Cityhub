import IssueForm from '../components/issues/IssueForm';
import Card from '../components/common/Card';
import { MapPinned, PenSquare, ShieldCheck } from 'lucide-react';

/**
 * Report Issue page
 */
const ReportIssue = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Card className="p-6 lg:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
              <PenSquare className="h-4 w-4 text-civic-300" />
              Report a new issue
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl">
              Capture the problem clearly and get it on the map.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
              Add a location, describe what happened, and help the right team understand the issue faster.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: MapPinned, title: 'Pin the exact spot', text: 'Place the issue precisely on the map.' },
                { icon: ShieldCheck, title: 'Add key details', text: 'Write enough context for a useful report.' },
                { icon: PenSquare, title: 'Submit in minutes', text: 'Complete the flow with a few guided steps.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <item.icon className="h-5 w-5 text-primary-300" />
                  <h2 className="mt-3 text-base font-semibold text-white">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <IssueForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
