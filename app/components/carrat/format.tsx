const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export const toArDigits = (s: string) => s.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)]);

/** "1 ct" / "٠٫٥٠ قيراط" — carat label in the design's format. */
export function caratLabel(ct: number, isAr: boolean) {
  const s = Number.isInteger(ct) ? String(ct) : ct.toFixed(2);
  return isAr ? `${toArDigits(s).replace('.', '٫')} قيراط` : `${s} ct`;
}

/** Whole-riyal price with the new Saudi Riyal mark (SARsym font maps "#" to the glyph). */
export function Price({ amount, isAr, from }: { amount: number | string; isAr: boolean; from?: boolean }) {
  const n = Math.round(Number(amount) || 0);
  const grouped = n.toLocaleString('en-US');
  const text = isAr ? toArDigits(grouped).replace(/,/g, '٬') : grouped;
  return (
    <span className="cc-price">
      {from && <span className="cc-price__from">{isAr ? 'من' : 'from'}</span>}
      <bdi>
        <span className="cc-price__int">{text}</span>
        <span className="cc-riyal" aria-label={isAr ? 'ريال سعودي' : 'SAR'}>
          #
        </span>
      </bdi>
    </span>
  );
}
