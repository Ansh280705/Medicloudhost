import { Zap, Stethoscope, ShieldCheck } from "lucide-react";

const stats = [
  {
    title: "Fast Online Sessions",
    desc: "Quick and hassle-free access to independent professionals.",
    icon: Zap,
  },
  {
    title: "Verified Professionals",
    desc: "Consult licensed and trusted experts.",
    icon: Stethoscope,
  },
  {
    title: "Secure Technology Platform",
    desc: "Your session data is protected with modern security standards.",
    icon: ShieldCheck,
  },
];

export default function StatsStrip() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 lg:px-20">
        
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="bg-card border rounded-2xl p-7 shadow-sm"
              >
                <div className="text-client mb-4">
                  <Icon className="w-7 h-7" />
                </div>

                <h4 className="font-semibold mb-2">
                  {item.title}
                </h4>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
