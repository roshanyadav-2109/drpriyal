import { AdminHeader, Panel } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { faqs } from "@/lib/sample-content";

export default function AdminFaqs() {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));
  return (
    <>
      <AdminHeader title="FAQs" subtitle="Manage the questions shown on the public FAQ page." />
      {categories.map((cat) => (
        <Panel key={cat} title={cat} className="mb-5">
          <ul className="divide-y divide-sand">
            {faqs
              .filter((f) => f.category === cat)
              .map((f) => (
                <li key={f.question} className="py-3">
                  <p className="font-medium text-ink">{f.question}</p>
                  <p className="mt-1 text-sm text-ink-soft">{f.answer}</p>
                  <Badge variant="outline" className="mt-2">
                    Published
                  </Badge>
                </li>
              ))}
          </ul>
        </Panel>
      ))}
    </>
  );
}
