export function debounce<T extends (...args: never[]) => void>(
  callback: T,
  timeout = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, timeout);
  };
}

type NumberFormatOptions = {
  absoluteFormat?: boolean;
  locales?: Intl.LocalesArgument;
} & Intl.NumberFormatOptions;

export const IntlNumberFormat = (
  value: number,
  options?: NumberFormatOptions
) => {
  const locales = options?.locales ?? "id-ID";
  const numberFormat = new Intl.NumberFormat(locales, {
    ...options,
  }).format(Math.abs(value));

  if (options?.absoluteFormat && value < 0) return `(${numberFormat})`;
  return numberFormat;
};

type DownloadBlobFileProps = {
  file: Blob;
  filename?: string;
};
export function downloadBlobFile({
  file,
  filename = "file",
}: DownloadBlobFileProps) {
  const url = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
