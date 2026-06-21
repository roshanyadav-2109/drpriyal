import { AdminHeader, Panel, NotConnected } from "@/components/admin/admin-ui";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export default function AdminConsultations() {
  const connected = isSupabaseConfigured();
  return (
    <>
      <AdminHeader
        title="Consultations & Prescriptions"
        subtitle="Visit notes and digital prescriptions, per Telemedicine Practice Guidelines."
      />
      {!connected ? (
        <NotConnected feature="consultations" />
      ) : (
        <Panel>
          <p className="py-10 text-center text-ink-soft">
            Completed consultations and issued prescriptions will appear here.
          </p>
        </Panel>
      )}

      <Panel title="Prescription requirements (India TPG 2020)" className="mt-6">
        <ul className="space-y-2 text-sm text-ink-soft">
          <li>• Doctor name, qualification, and medical council registration number.</li>
          <li>• Patient identity and consent recorded before the consult.</li>
          <li>• Diagnosis, medicines (drug, dose, frequency, duration), and advice.</li>
          <li>• Digital signature and date; no prohibited-list drugs via teleconsult.</li>
          <li>• Delivered to the patient on WhatsApp and email as a PDF.</li>
        </ul>
      </Panel>
    </>
  );
}
