
export default function ResultHeaderSection({
  title,
  subtitle,
}: Readonly<{ title: string; subtitle: string }>) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}
