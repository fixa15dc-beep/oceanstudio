import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MediaField } from "../../../components/Uploader";

export function Panel({ title, hint, children, testId }) {
    return (
        <section className="rounded-sm border border-white/10 bg-[#0A1220] p-6 sm:p-8" data-testid={testId}>
            <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
            {hint && <p className="mt-1 text-xs text-white/45">{hint}</p>}
            <div className="mt-6 grid gap-5">{children}</div>
        </section>
    );
}

export function TextField({ label, value, onChange, testId, placeholder, className = "" }) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <Label>{label}</Label>
            <Input data-testid={testId} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        </div>
    );
}

export function AreaField({ label, value, onChange, testId, rows = 3, hint }) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            <Textarea data-testid={testId} rows={rows} value={value || ""} onChange={(e) => onChange(e.target.value)} />
            {hint && <p className="text-xs text-white/45">{hint}</p>}
        </div>
    );
}

export function ImageField({ label, value, onChange, testId, accept = "image" }) {
    return (
        <div className="space-y-1.5">
            <Label>{label}</Label>
            <MediaField value={value} onChange={onChange} testId={testId} accept={accept} />
        </div>
    );
}
