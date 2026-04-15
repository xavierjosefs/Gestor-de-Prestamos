"use client";

import { clearSession } from "@/app/src/modules/auth/services/session.service";
import type { ClientLoanRecord } from "@/app/src/modules/client/types/client.types";
import AppSidebar from "@/app/src/modules/dashboard/components/AppSidebar";
import { getLoanByIdService } from "@/app/src/modules/loan/services/loan.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function LoanDetailPageView({ loanId }: { loanId: string }) {
  const router = useRouter();
  const [loan, setLoan] = useState<ClientLoanRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadLoan = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLoanByIdService(loanId);

        if (!cancelled) {
          setLoan(data);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "No se pudo cargar el prestamo.";

        if (!cancelled) {
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadLoan();

    return () => {
      cancelled = true;
    };
  }, [loanId]);

  const paymentSummary = useMemo(() => {
    if (!loan) {
      return {
        totalPaid: 0,
        interestPaid: 0,
        principalPaid: 0,
      };
    }

    return loan.payments.reduce(
      (summary, payment) => ({
        totalPaid: summary.totalPaid + payment.amount,
        interestPaid: summary.interestPaid + payment.interestPaid,
        principalPaid: summary.principalPaid + payment.principalPaid,
      }),
      {
        totalPaid: 0,
        interestPaid: 0,
        principalPaid: 0,
      }
    );
  }, [loan]);

  const handleExpiredSession = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <main className="bg-[#f4f7fb] text-[#213754] lg:h-screen lg:overflow-hidden">
      <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row">
        <AppSidebar />

        <section className="flex-1 lg:overflow-y-auto">
          <header className="flex flex-col gap-4 border-b border-[#dfe6ef] bg-white px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#67b549]">
                Prestamo
              </p>
              <h1 className="mt-1 text-[2rem] font-bold tracking-[-0.03em] text-[#102844]">
                Detalle del Préstamo
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/loans"
                className="inline-flex h-11 items-center rounded-xl border border-[#d9e2ed] bg-white px-5 text-sm font-semibold text-[#60748d] transition hover:bg-[#f8fafc]"
              >
                Volver a Prestamos
              </Link>
              <Link
                href="/loans/new"
                className="inline-flex h-11 items-center rounded-xl bg-[#63b649] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(99,182,73,0.24)] transition hover:bg-[#54a13c]"
              >
                Nuevo Prestamo
              </Link>
            </div>
          </header>

          <div className="space-y-6 px-5 py-8 sm:px-8">
            {loading ? (
              <section className="rounded-[24px] border border-[#d8e2ee] bg-white px-6 py-12 text-center text-sm text-[#7b8da2] shadow-[0_12px_34px_rgba(29,46,77,0.05)]">
                Cargando detalle del prestamo...
              </section>
            ) : error ? (
              <section className="rounded-[24px] border border-[#f5caca] bg-[#fff5f5] px-6 py-5 text-sm text-[#c24141]">
                {error === "Tu sesion expiro. Inicia sesion nuevamente." ? (
                  <span>
                    {error}{" "}
                    <button
                      type="button"
                      onClick={handleExpiredSession}
                      className="font-semibold underline"
                    >
                      Volver al login
                    </button>
                  </span>
                ) : (
                  error
                )}
              </section>
            ) : loan ? (
              <>
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Referencia" value={formatLoanCode(loan.id)} />
                  <MetricCard label="Monto Inicial" value={formatCurrency(loan.principalAmount)} />
                  <MetricCard label="Saldo Pendiente" value={formatCurrency(loan.remainingBalance)} accent />
                  <MetricCard label="Total Adeudado" value={formatCurrency(loan.currentTotalDue)} />
                </section>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="space-y-6">
                    <DetailCard title="Información General">
                      <div className="grid gap-4 md:grid-cols-2">
                        <InfoBlock label="Frecuencia" value={loan.frequency === "MONTHLY" ? "Mensual" : "Quincenal"} />
                        <InfoBlock label="Estado" value={loan.status === "PAID" ? "Liquidado" : loan.status === "LATE" ? "En Mora" : "Activo"} />
                        <InfoBlock label="Tasa de interés" value={`${loan.interestRate}%`} />
                        <InfoBlock label="Fecha de inicio" value={formatDate(loan.startDate)} />
                        <InfoBlock label="Último pago" value={formatDate(loan.lastPaymentDate)} />
                        <InfoBlock label="Próximo vencimiento" value={formatDate(loan.nextDueDate)} />
                      </div>
                    </DetailCard>

                    <DetailCard title="Historial de Pagos">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                          <thead className="bg-[#f7f9fc] text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a9aaf]">
                            <tr>
                              <th className="px-4 py-4">Fecha</th>
                              <th className="px-4 py-4">Monto</th>
                              <th className="px-4 py-4">Interés</th>
                              <th className="px-4 py-4">Capital</th>
                              <th className="px-4 py-4">Saldo</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {loan.payments.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#7b8da2]">
                                  Este prestamo aun no tiene pagos registrados.
                                </td>
                              </tr>
                            ) : (
                              loan.payments.map((payment) => (
                                <tr key={payment.id} className="border-t border-[#edf1f6]">
                                  <td className="px-4 py-4 text-sm text-[#52657c]">{formatDate(payment.paymentDate)}</td>
                                  <td className="px-4 py-4 text-sm font-semibold text-[#24384f]">{formatCurrency(payment.amount)}</td>
                                  <td className="px-4 py-4 text-sm text-[#52657c]">{formatCurrency(payment.interestPaid)}</td>
                                  <td className="px-4 py-4 text-sm text-[#52657c]">{formatCurrency(payment.principalPaid)}</td>
                                  <td className="px-4 py-4 text-sm text-[#52657c]">{formatCurrency(payment.remainingBalance)}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </DetailCard>
                  </div>

                  <div className="space-y-6">
                    <DetailCard title="Resumen Financiero">
                      <div className="space-y-4">
                        <InfoBlock label="Interés acumulado actual" value={formatCurrency(loan.currentAccruedInterest)} />
                        <InfoBlock label="Total pagado" value={formatCurrency(paymentSummary.totalPaid)} />
                        <InfoBlock label="Pagado a interés" value={formatCurrency(paymentSummary.interestPaid)} />
                        <InfoBlock label="Pagado a capital" value={formatCurrency(paymentSummary.principalPaid)} />
                      </div>
                    </DetailCard>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-[#dfe6ef] bg-white px-5 py-5 shadow-[0_12px_34px_rgba(29,46,77,0.05)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a9aaf]">{label}</p>
      <p className={`mt-3 text-[1.95rem] font-bold tracking-[-0.04em] ${accent ? "text-[#63b649]" : "text-[#24384f]"}`}>{value}</p>
    </div>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-[#d8e2ee] bg-white shadow-[0_12px_34px_rgba(29,46,77,0.05)]">
      <div className="border-b border-[#e7edf5] px-6 py-5">
        <h2 className="text-[1.5rem] font-bold tracking-[-0.03em] text-[#102844]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e7edf5] bg-[#fbfcfe] px-4 py-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#7f91a6]">{label}</p>
      <p className="mt-2 break-words text-base font-semibold text-[#24384f]">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLoanCode(loanId: string) {
  return `#PR-${loanId.slice(0, 4).toUpperCase()}`;
}
