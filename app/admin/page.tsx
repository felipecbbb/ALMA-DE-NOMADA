"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatPrice, slugify } from "@/lib/store-utils";
import { DashboardStats, OrderRecord, ProductRecord } from "@/lib/store-types";

type TabKey = "resumen" | "productos" | "pedidos";

const emptyForm = {
  id: "",
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  galleryImages: "",
  priceEur: "13",
  currency: "EUR",
  active: true,
};

function toMoneyInput(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",");
}

function fromMoneyInput(raw: string) {
  const normalized = raw.replace(",", ".").trim();
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100);
}

export default function AdminPage() {
  const [tab, setTab] = useState<TabKey>("resumen");
  const [adminKey, setAdminKey] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [savingProduct, setSavingProduct] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const isEditing = useMemo(() => form.id !== "", [form.id]);

  const authHeaders = useMemo(
    () => ({ "x-admin-key": adminKey, "content-type": "application/json" }),
    [adminKey],
  );

  const loadData = async (key = adminKey) => {
    try {
      setLoading(true);
      setError(null);

      const headers = { "x-admin-key": key };
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        fetch("/api/stats", { headers }),
        fetch("/api/products?all=1", { headers }),
        fetch("/api/orders", { headers }),
      ]);

      const [statsPayload, productsPayload, ordersPayload] = await Promise.all([
        statsRes.json(),
        productsRes.json(),
        ordersRes.json(),
      ]);

      if (!statsRes.ok) {
        throw new Error(statsPayload.error ?? "No se pudo cargar estadísticas.");
      }
      if (!productsRes.ok) {
        throw new Error(productsPayload.error ?? "No se pudo cargar productos.");
      }
      if (!ordersRes.ok) {
        throw new Error(ordersPayload.error ?? "No se pudo cargar pedidos.");
      }

      setStats(statsPayload.stats ?? null);
      setProducts(productsPayload.products ?? []);
      setOrders(ordersPayload.orders ?? []);
      setConnected(true);
    } catch (err) {
      setConnected(false);
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = window.localStorage.getItem("alma_admin_key") ?? "";
    if (saved) {
      setAdminKey(saved);
      void loadData(saved);
    }
  }, []);

  const handleConnect = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!adminKey.trim()) {
      setError("Introduce la clave de administración.");
      return;
    }

    window.localStorage.setItem("alma_admin_key", adminKey.trim());
    await loadData(adminKey.trim());
  };

  const handleLogout = () => {
    setConnected(false);
    setStats(null);
    setProducts([]);
    setOrders([]);
    setAdminKey("");
    setForm(emptyForm);
    window.localStorage.removeItem("alma_admin_key");
  };

  const resetForm = () => setForm(emptyForm);

  const editProduct = (product: ProductRecord) => {
    setTab("productos");
    setForm({
      id: product.id,
      title: product.title,
      slug: product.slug,
      shortDescription: product.short_description ?? "",
      description: product.description ?? "",
      imageUrl: product.image_url,
      galleryImages: Array.isArray(product.gallery_images)
        ? product.gallery_images.join("\n")
        : "",
      priceEur: toMoneyInput(product.price_cents),
      currency: product.currency,
      active: product.active,
    });
  };

  const saveProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const priceCents = fromMoneyInput(form.priceEur);
    if (!priceCents) {
      setError("El precio debe ser mayor que cero.");
      return;
    }

    const title = form.title.trim();
    const imageUrl = form.imageUrl.trim();
    if (!title || !imageUrl) {
      setError("Título e imagen principal son obligatorios.");
      return;
    }

    const payload = {
      title,
      slug: form.slug.trim() ? slugify(form.slug) : slugify(title),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      imageUrl,
      galleryImages: form.galleryImages,
      priceCents,
      currency: form.currency.trim().toUpperCase(),
      active: form.active,
    };

    try {
      setSavingProduct(true);
      setError(null);

      const endpoint = isEditing ? `/api/products/${form.id}` : "/api/products";
      const method = isEditing ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo guardar el producto.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSavingProduct(false);
    }
  };

  const deleteProduct = async (id: string) => {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.",
    );
    if (!confirmed) return;

    try {
      setError(null);
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo eliminar el producto.");
      }
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setError(null);
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "No se pudo actualizar el pedido.");
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  if (!connected) {
    return (
      <main className="min-h-screen bg-background px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Panel admin
          </p>
          <h1 className="mt-3 text-4xl font-semibold uppercase text-foreground md:text-5xl">
            Iniciar sesión
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Accede con la clave de administración para gestionar productos, pedidos
            y estadísticas.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleConnect}>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Clave admin
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Introduce ADMIN_PANEL_KEY"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Conectando..." : "Entrar al panel"}
            </button>
          </form>

          {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Panel admin
            </p>
            <h1 className="mt-2 text-4xl font-semibold uppercase text-foreground md:text-5xl">
              Gestión tienda
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadData()}
              disabled={loading}
              className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground"
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["resumen", "productos", "pedidos"] as TabKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] ${
                tab === key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {tab === "resumen" && stats ? (
          <section className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Facturación total
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {formatPrice(stats.totalRevenueCents, "EUR")}
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Pedidos
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {stats.totalOrders}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pagados: {stats.paidOrders}
              </p>
            </article>
            <article className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Ticket medio
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {formatPrice(stats.averageOrderValueCents, "EUR")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Productos activos: {stats.activeProducts}/{stats.totalProducts}
              </p>
            </article>
          </section>
        ) : null}

        {tab === "productos" ? (
          <section className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
            <article className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-xl font-semibold text-foreground">
                {isEditing ? "Editar producto" : "Nuevo producto"}
              </h2>
              <form className="mt-4 space-y-3" onSubmit={saveProduct}>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Título"
                />
                <input
                  value={form.slug}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, slug: event.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Slug (opcional)"
                />
                <input
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, imageUrl: event.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder="URL imagen principal"
                />
                <textarea
                  value={form.shortDescription}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      shortDescription: event.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Descripción corta"
                />
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Descripción larga"
                />
                <textarea
                  value={form.galleryImages}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, galleryImages: event.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  placeholder="Galería (una URL por línea)"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={form.priceEur}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, priceEur: event.target.value }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Precio (ej: 13,00)"
                  />
                  <input
                    value={form.currency}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, currency: event.target.value }))
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Moneda (EUR)"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, active: event.target.checked }))
                    }
                  />
                  Producto activo en el frontend
                </label>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingProduct}
                    className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    {savingProduct
                      ? "Guardando..."
                      : isEditing
                        ? "Actualizar"
                        : "Crear producto"}
                  </button>
                  {isEditing ? (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-foreground"
                    >
                      Cancelar edición
                    </button>
                  ) : null}
                </div>
              </form>
            </article>

            <article className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="overflow-auto">
                <table className="w-full min-w-[720px] border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      <th className="px-4 py-3">Producto</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Actualizado</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border text-sm">
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground">{product.title}</p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatPrice(product.price_cents, product.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              product.active
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            {product.active ? "Activo" : "Oculto"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(product.updated_at).toLocaleDateString("es-ES")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => editProduct(product)}
                              className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteProduct(product.id)}
                              className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-sm text-muted-foreground"
                        >
                          No hay productos todavía.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </article>
          </section>
        ) : null}

        {tab === "pedidos" ? (
          <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="overflow-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Importe</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Stripe session</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const firstItem = order.items?.[0];
                    return (
                      <tr key={order.id} className="border-b border-border text-sm">
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(order.created_at).toLocaleString("es-ES")}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {order.customer_email ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {firstItem?.description ?? order.metadata?.product_title ?? "-"}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {formatPrice(order.total_cents, order.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={order.status}
                            onChange={(event) =>
                              void updateOrderStatus(order.id, event.target.value)
                            }
                            className="rounded-lg border border-border bg-background px-2 py-1 text-sm text-foreground"
                          >
                            <option value="pending">pending</option>
                            <option value="paid">paid</option>
                            <option value="cancelled">cancelled</option>
                            <option value="refunded">refunded</option>
                            <option value="expired">expired</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {order.stripe_session_id}
                        </td>
                      </tr>
                    );
                  })}
                  {orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                      >
                        No hay pedidos todavía.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
