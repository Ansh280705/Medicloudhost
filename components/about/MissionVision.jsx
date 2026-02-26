import Image from "next/image";

export default function MissionVision() {
  return (
    <section className="py-10 bg-muted/40">
      <div className="container mx-auto px-6 lg:px-20 grid md:grid-cols-2 gap-16 items-center">
        
        {/* TEXT (Left) */}
        <div className="order-2 md:order-1">
          <h3 className="text-2xl font-semibold mb-4">
            Our Mission
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Our mission is to make quality professional services accessible and affordable
            through digital innovation, enabling users to consult experts
            online without unnecessary delays or hidden costs.
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            Our Vision
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            We envision DoctorDesk as a trusted digital platform that
            empowers users, supports professionals, and transforms the future of
            online professional sessions.
          </p>
        </div>

        {/* IMAGE (Right) */}
        <div className="order-1 md:order-2">
          <Image
            src="/about/mission02.png"
            alt="Digital healthcare mission and vision"
            width={620}
            height={620}
            className="rounded-3xl object-cover"
          />
        </div>

      </div>
    </section>
  );
}
