export function AboutTab() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-muted/5 p-6 lg:p-8">
        <h4 className="text-sm font-semibold text-foreground mb-4">Tentang Aplikasi</h4>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>CIDWatch adalah platform streaming drama dan anime terbaik dengan koleksi konten yang terus diperbarui.</p>
          <p>Versi: 1.0.0</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/5 p-6">
        <h4 className="text-sm font-semibold text-foreground mb-4">Bantuan</h4>
        <p className="text-sm text-muted-foreground">Butuh bantuan? Hubungi tim support kami.</p>
      </div>
    </div>
  );
}
