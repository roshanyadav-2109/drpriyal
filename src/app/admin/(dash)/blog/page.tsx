import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader, Panel } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/lib/sample-content";
import { formatDate } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/status";

export default function AdminBlog() {
  const connected = isSupabaseConfigured();
  return (
    <>
      <AdminHeader
        title="Blog & Content"
        subtitle="Author and publish women's-health articles."
        action={
          <Button size="sm" disabled={!connected} title={connected ? "" : "Connect Supabase first"}>
            <Plus /> New article
          </Button>
        }
      />

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sand text-xs uppercase tracking-wide text-ink-faint">
                <th className="pb-3">Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand">
              {blogPosts.map((p) => (
                <tr key={p.slug}>
                  <td className="py-3 font-medium text-ink">{p.title}</td>
                  <td className="py-3 text-ink-soft">{p.category}</td>
                  <td className="py-3 text-ink-soft">{formatDate(p.date)}</td>
                  <td className="py-3">
                    <Badge>Published</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <Link href={`/blog/${p.slug}`} className="text-sm text-pine hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!connected && (
          <p className="mt-5 text-xs text-ink-faint">
            These are seeded sample articles defined in{" "}
            <code className="rounded bg-bone px-1">src/lib/sample-content.ts</code>. Connect Supabase
            to author and store articles in the database.
          </p>
        )}
      </Panel>
    </>
  );
}
