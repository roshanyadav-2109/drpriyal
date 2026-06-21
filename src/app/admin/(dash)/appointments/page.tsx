import { AdminHeader, Panel, NotConnected } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export default function AdminAppointments() {
  const connected = isSupabaseConfigured();

  return (
    <>
      <AdminHeader title="Appointments" subtitle="Manage bookings, confirmations, and follow-ups." />
      {!connected ? (
        <NotConnected feature="appointments" />
      ) : (
        <Panel>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-sand text-xs uppercase tracking-wide text-ink-faint">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Mode</th>
                  <th className="pb-3">When</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="py-10 text-center text-ink-soft">
                    No appointments yet. New bookings will appear here.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel title="How bookings flow" className="mt-6">
        <ol className="space-y-3 text-sm text-ink-soft">
          <li className="flex gap-3">
            <Badge variant="solid">1</Badge> Patient books a slot (no account needed) and pays via Razorpay, or requests via WhatsApp.
          </li>
          <li className="flex gap-3">
            <Badge variant="solid">2</Badge> Payment is verified server-side; the appointment is confirmed.
          </li>
          <li className="flex gap-3">
            <Badge variant="solid">3</Badge> Confirmation + joining link sent on WhatsApp & email; reminders at 24h and 1h.
          </li>
          <li className="flex gap-3">
            <Badge variant="solid">4</Badge> After the consult, you issue a digital prescription and optional follow-up.
          </li>
        </ol>
      </Panel>
    </>
  );
}
