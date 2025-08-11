import { Link } from "wouter";
import { Pill, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                <img 
                  src="/assets/IMG_1598 (1)_1754952167373.PNG" 
                  alt="Smile Pills Ltd - Smile Forever" 
                  className="h-12 w-auto object-contain brightness-0 invert"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Ghana's trusted pharmaceutical wholesale and medical supplies company, 
              delivering health with trust, quality, and convenience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/about">
                <span className="block text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  About Us
                </span>
              </Link>
              <a href="#" className="block text-gray-400 hover:text-primary transition-colors">
                Our Pharmacists
              </a>
              <a href="#" className="block text-gray-400 hover:text-primary transition-colors">
                Health Blog
              </a>
              <a href="#" className="block text-gray-400 hover:text-primary transition-colors">
                FAQs
              </a>
              <Link href="/contact">
                <span className="block text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  Contact Us
                </span>
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <nav className="space-y-2 text-sm">
              <Link href="/shop?category=prescription-drugs">
                <span className="block text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  Prescription Drugs
                </span>
              </Link>
              <Link href="/shop?category=over-the-counter">
                <span className="block text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  Over-the-Counter
                </span>
              </Link>
              <Link href="/shop?category=health-supplements">
                <span className="block text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  Supplements
                </span>
              </Link>
              <Link href="/shop?category=first-aid">
                <span className="block text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  First Aid
                </span>
              </Link>
              <Link href="/shop?category=medical-devices">
                <span className="block text-gray-400 hover:text-primary transition-colors cursor-pointer">
                  Medical Devices
                </span>
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400">
                  East Legon Hills<br />
                  Accra, Ghana
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400">0544137947 | +233 209339912</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="h-4 w-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
                <a href="https://wa.me/233200751811" target="_blank" className="text-gray-400 hover:text-primary transition-colors">
                  WhatsApp: 020 075 1811
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400">smilepills21@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400">Monday-Saturday, 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2025 Smile Pills Ltd. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/privacy">
              <span className="text-gray-400 hover:text-primary transition-colors cursor-pointer">
                Privacy Policy
              </span>
            </Link>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
