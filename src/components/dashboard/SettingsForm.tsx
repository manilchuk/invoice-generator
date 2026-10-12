'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import styles from '@/app/dashboard/settings/settings.module.css';

interface Profile {
  id: string;
  email: string | null;
  company_name: string | null;
  tax_id: string | null;
  iban: string | null;
  bank_name: string | null;
  address: string | null;
  logo_url: string | null;
}

interface SettingsFormProps {
  profile: Profile;
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    company_name: profile.company_name ?? '',
    tax_id: profile.tax_id ?? '',
    iban: profile.iban ?? '',
    bank_name: profile.bank_name ?? '',
    address: profile.address ?? '',
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(profile.logo_url);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Перевірки
    if (file.size > 2 * 1024 * 1024) {
      setError('Логотип має бути менше 2 МБ');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Тільки зображення (PNG, JPG, SVG)');
      return;
    }

    setError('');
    setUploading(true);

    const ext = file.name.split('.').pop();
    const path = `${profile.id}/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError(`Помилка завантаження: ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('logos').getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    // Зберігаємо URL у профілі
    await supabase.from('profiles').update({ logo_url: data.publicUrl }).eq('id', profile.id);

    setLogoUrl(publicUrl);
    setUploading(false);
    router.refresh();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        company_name: form.company_name || null,
        tax_id: form.tax_id || null,
        iban: form.iban || null,
        bank_name: form.bank_name || null,
        address: form.address || null,
      })
      .eq('id', profile.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSuccess('Збережено!');
    setSaving(false);
    router.refresh();

    setTimeout(() => setSuccess(''), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card padded={false}>
        <CardHeader
          title="Логотип"
          description="З'явиться на рахунках. PNG, JPG або SVG, до 2 МБ"
        />
        <div style={{ padding: 24 }}>
          <div className={styles.logoPreview}>
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Логотип" className={styles.logoImage} />
            ) : (
              <div className={styles.logoPlaceholder}>Немає логотипу</div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                id="logo-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="logo-upload">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={uploading}
                  onClick={() => document.getElementById('logo-upload')?.click()}
                >
                  {logoUrl ? 'Змінити' : 'Завантажити'}
                </Button>
              </label>
            </div>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <CardHeader title="Реквізити" description="Ці дані з'являться на всіх ваших рахунках" />
        <div style={{ padding: 24 }} className={styles.form}>
          <Input
            label="Назва (ФОП / Ім'я)"
            name="company_name"
            placeholder="ФОП Іваненко Іван Іванович"
            value={form.company_name}
            onChange={(e) => update('company_name', e.target.value)}
            required
          />

          <div className={styles.row}>
            <Input
              label="ІПН / ЄДРПОУ"
              name="tax_id"
              placeholder="1234567890"
              value={form.tax_id}
              onChange={(e) => update('tax_id', e.target.value)}
            />
            <Input
              label="IBAN / Номер картки"
              name="iban"
              placeholder="UA12 3456 7890 1234 5678 9012 3456 7"
              value={form.iban}
              onChange={(e) => update('iban', e.target.value)}
            />
          </div>

          <Input
            label="Банк"
            name="bank_name"
            placeholder="ПриватБанк"
            value={form.bank_name}
            onChange={(e) => update('bank_name', e.target.value)}
          />

          <Textarea
            label="Адреса"
            name="address"
            placeholder="м. Київ, вул. Хрещатик, 1"
            value={form.address}
            onChange={(e) => update('address', e.target.value)}
            rows={3}
          />
        </div>
      </Card>

      <div className={styles.actions}>
        <Button type="submit" loading={saving}>
          Зберегти
        </Button>
      </div>
    </form>
  );
}
