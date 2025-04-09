import { getProspects, getCategories, getProspectCountByCategory } from '@/lib/db';
import { getRecentCalls, getUpcomingFollowUps } from '@/lib/db';
import ProspectsTable from '@/components/ProspectsTable';
import Link from 'next/link';

export const runtime = 'edge';

export default async function Dashboard({ cf }) {
  const db = cf.d1.DB;
  
  // Fetch data for dashboard
  const prospects = await getProspects(db);
  const categories = await getCategories(db);
  const categoryCounts = await getProspectCountByCategory(db);
  const recentCalls = await getRecentCalls(db, 5);
  const upcomingFollowUps = await getUpcomingFollowUps(db, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Prospect Count Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Total Prospects</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">{prospects.length}</p>
          <div className="mt-4">
            <Link
              href="/prospects"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all prospects →
            </Link>
          </div>
        </div>
        
        {/* Recent Calls Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Recent Calls</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">{recentCalls.length}</p>
          <div className="mt-4">
            <Link
              href="/calls"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all calls →
            </Link>
          </div>
        </div>
        
        {/* Upcoming Follow-ups Card */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Follow-ups</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">{upcomingFollowUps.length}</p>
          <div className="mt-4">
            <Link
              href="/calls?filter=upcoming"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all follow-ups →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Upcoming Follow-ups Section */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Follow-ups</h2>
        {upcomingFollowUps.length > 0 ? (
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Prospect
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Follow-up Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Notes
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {upcomingFollowUps.map((call) => (
                  <tr key={call.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <Link href={`/prospects/${call.prospect_id}`} className="hover:text-blue-600">
                        {call.prospect_name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(call.follow_up_date).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500">
                      {call.follow_up_notes ? (
                        call.follow_up_notes.length > 50 ? 
                          `${call.follow_up_notes.substring(0, 50)}...` : 
                          call.follow_up_notes
                      ) : '-'}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link href={`/calls/${call.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No upcoming follow-ups.</p>
        )}
      </div>
      
      {/* Recent Calls Section */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-medium text-gray-900">Recent Calls</h2>
        {recentCalls.length > 0 ? (
          <div className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Prospect
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date & Time
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Outcome
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {recentCalls.map((call) => (
                  <tr key={call.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                      <Link href={`/prospects/${call.prospect_id}`} className="hover:text-blue-600">
                        {call.prospect_name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {new Date(call.call_date).toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {call.outcome || '-'}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link href={`/calls/${call.id}`} className="text-blue-600 hover:text-blue-900">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">No recent calls.</p>
        )}
      </div>
    </div>
  );
}
