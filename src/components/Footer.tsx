import footerContent from '@/footer-content.json';

export default function Footer() {
    const footer = footerContent;

    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">
                            {footer.about.title}
                        </h3>
                        <p className="text-sm leading-relaxed">{footer.about.text}</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {footer.links.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-sm hover:text-red-500 transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href={`mailto:${footer.contact.email}`}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    {footer.contact.email}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${footer.contact.phone}`}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    {footer.contact.phone}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            {footer.socials.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                                    aria-label={social.platform}
                                >
                                    {social.platform.charAt(0)}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>{footer.copyright}</p>
                </div>
            </div>
        </footer>
    );
}
