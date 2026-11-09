import { notFound } from "next/navigation";
import Link from "next/link";
import { getLanding } from "@/lib/repo";
import { LANDING_FIELDS } from "@/lib/admin-schemas";
import { SchemaForm } from "@/components/admin/schema-form";
import { DangerButton, Notice, PageTitle } from "@/components/admin/ui";
import { deleteLandingAction, saveLandingAction } from "../../../actions";

export default async function EditLanding({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const isNew = id === "novo";
  const landing = isNew ? null : await getLanding(Number(id), { includeInactive: true });
  if (!isNew && !landing) notFound();
  const initial = landing ?? { active: true, noindex: true, benefits: [], included: [], steps: [], faqs: [], ctaLabel: "Quero uma proposta" };
  return (
    <>
      <PageTitle
        title={isNew ? "Nova landing page" : landing!.title}
        action={
          landing ? (
            <Link href={`/lp/${landing.slug}`} target="_blank" className="btn btn-ghost !min-h-11">
              Ver página
            </Link>
          ) : undefined
        }
      />
      {sp.criado && <Notice>Landing page criada.</Notice>}
      <SchemaForm fields={LANDING_FIELDS} initial={initial} action={saveLandingAction.bind(null, landing?.id ?? null)} />
      {landing && (
        <form action={deleteLandingAction} className="mt-10 border-t hairline pt-6">
          <input type="hidden" name="id" value={landing.id} />
          <DangerButton confirm={`Excluir "${landing.title}"? Anúncios que apontam para esta página deixarão de funcionar.`}>Excluir landing page</DangerButton>
        </form>
      )}
    </>
  );
}
