import { notFound } from "next/navigation";
import Link from "next/link";
import { getService } from "@/lib/repo";
import { SERVICE_FIELDS } from "@/lib/admin-schemas";
import { SchemaForm } from "@/components/admin/schema-form";
import { DangerButton, Notice, PageTitle } from "@/components/admin/ui";
import { deleteServiceAction, saveServiceAction } from "../../../actions";

export default async function EditService({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const isNew = id === "novo";
  const service = isNew ? null : await getService(Number(id), { includeInactive: true });
  if (!isNew && !service) notFound();
  const initial = service ?? {
    active: true,
    position: 99,
    icon: "file-text",
    benefits: [],
    included: [],
    audience: [],
    steps: [],
    faqs: [],
    whatsappMessage: "Olá! Gostaria de saber mais sobre este serviço.",
  };
  return (
    <>
      <PageTitle
        title={isNew ? "Novo serviço" : service!.title}
        action={
          service ? (
            <Link href={`/servicos/${service.slug}`} target="_blank" className="btn btn-ghost !min-h-11">
              Ver página
            </Link>
          ) : undefined
        }
      />
      {sp.criado && <Notice>Serviço criado.</Notice>}
      <SchemaForm fields={SERVICE_FIELDS} initial={initial} action={saveServiceAction.bind(null, service?.id ?? null)} />
      {service && (
        <form action={deleteServiceAction} className="mt-10 border-t hairline pt-6">
          <input type="hidden" name="id" value={service.id} />
          <DangerButton confirm={`Excluir o serviço "${service.title}"? Para apenas ocultar, desmarque "Serviço ativo".`}>Excluir serviço</DangerButton>
        </form>
      )}
    </>
  );
}
