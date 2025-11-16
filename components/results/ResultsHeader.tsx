
export default function ResultHeaderSection({
  title,
  subtitle,
}: Readonly<{ title: string; subtitle: string }>) {
  return (
    <div className="container mx-auto px-6 lg:px-16 py-6 lg:py-8">
      <div className="space-y-3 lg:space-y-4">
        <h1 className="font-montserrat font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
          {title}
        </h1>
        <p className="text-white/80 font-montserrat text-lg sm:text-xl lg:text-2xl">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
