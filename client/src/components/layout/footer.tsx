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
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Pill className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">SmilePills</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online pharmacy providing quality medications and health products 
              with professional care and convenience.
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
                  123 Health Street<br />
                  Medical District, MD 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400">support@smilepills.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-400">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; 2024 SmilePills. All rights reserved.
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
