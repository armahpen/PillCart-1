import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useMemo } from "react";

const Index = () => {
  const orgJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Smile Pills Ltd",
    url: "/",
    logo: "/favicon.ico",
    sameAs: [],
  }), []);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="hero relative min-h-[70vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://lh3.googleusercontent.com/d/1g-Wndw3JAuCTqawSBqXIZoi4J7x9YRlT=w1200"
              alt="Female doctor showing professional healthcare services"
              className="w-full h-full object-cover object-center"
            />
            {/* Light white overlay for text readability */}
            <div className="absolute inset-0 bg-white/75"></div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 bg-white/40 backdrop-blur-sm p-8 rounded-lg border border-white/20">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-neutral leading-tight">
                  Online Pharmacy & Prescription Services
                </h1>
                <p className="text-base lg:text-lg text-gray-800 leading-relaxed font-medium">
                  Order your prescriptions and shop trusted health essentials with fast, discreet delivery across Ghana.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a 
                    href="https://wa.me/233209339912"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-center inline-flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                    </svg>
                    Order Prescription
                  </a>
                  <button className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200">
                    Shop Medicines
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-white py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">Licensed Pharmacy</h3>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">Fast Delivery</h3>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">Secure & Discreet</h3>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">Expert Support</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-16 bg-gray-50" id="shop">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Categories</h2>
              <p className="text-lg text-gray-600 leading-relaxed">Browse over-the-counter medicines and everyday health essentials.</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { title: "Vitamins & Multivitamins" },
                  { title: "Pain Relief" },
                  { title: "Dietary Supplements" },
                  { title: "Skin Care & Acne" },
                ].map((c) => (
                  <article key={c.title} className="text-center p-8 rounded-xl border bg-white hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{c.title}</h3>
                    <p className="text-primary font-semibold hover:text-primary/80 transition-colors">Shop now</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;