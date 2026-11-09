import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin, requireUser } from "@/lib/auth";
import { getGroup } from "@/lib/repo";
import { GROUP_MAP } from "@/lib/settings-schema";
import { SchemaForm } from "@/components/admin/schema-form";
import { Notice, PageTitle } from "@/components/admin/ui";
import { saveGroupAction } from "../../../actions";

const PREVIEW: Record<string, string> = { home: "/", sobre: "/sobre", contato: "/contato", privacidade: "/politica-de-privacidade" };

export default async function GroupPage({ params }: { params: Promise<{ grupo: string }> }) {
  const { grupo } = await params;
  const group = GROUP_MAP[grupo];
  if (!group) notFound();
  if (group.adminOnly) await requireAdmin();
  else await requireUser();
  const values = await getGroup(grupo);
  const smtpReady = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

  return (
    <>
      <PageTitle
        title={group.title}
        description={group.description}
        action={
          PREVIEW[grupo] ? (
            <Link href={PREVIEW[grupo]} target="_blank" className="btn btn-ghost !min-h-11">
              Ver no site
            </Link>
          ) : undefined
        }
      />
      {grupo === "integracoes" && (
        <Notice tone={smtpReady ? "ok" : "warn"}>
          {smtpReady
            ? "SMTP configurado na hospedagem: os leads serão enviados ao e-mail informado abaixo."
            : "SMTP não configurado: o envio de leads por e-mail fica desativado até definir SMTP_HOST, SMTP_USER e SMTP_PASS na hospedagem. Os leads continuam salvos no painel."}
        </Notice>
      )}
      {grupo === "privacidade" && (
        <Notice tone="warn">
          Modelo de referência baseado na LGPD. Revise com assessoria jurídica. Termos disponíveis: {"{{razao_social}}"}, {"{{cnpj}}"},{" "}
          {"{{encarregado}}"}, {"{{email_privacidade}}"}, {"{{data_atualizacao}}"}.
        </Notice>
      )}
      <SchemaForm fields={group.fields} initial={values} action={saveGroupAction.bind(null, grupo)} />
    </>
  );
}
