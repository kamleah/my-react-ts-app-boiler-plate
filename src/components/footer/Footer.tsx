const Footer = () => {
    return (
        <footer className="bg-zinc-800 text-white py-6 px-8">
            <div className="container mx-auto">
                <p className="text-sm mb-4">
                    ©2025 PwC. All rights reserved. PwC refers to the PwC network and/or one or more of its member firms, each of which is a separate legal entity. Please see{" "}
                    <a href="https://www.pwc.com/gx/en/about/corporate-governance/network-structure.html" target="_blank" className="underline hover:text-gray-300">
                        pwc.com/structure
                    </a>{" "}
                    for further details.
                </p>
                <div className="flex gap-6 text-sm">
                    <a href="https://www.pwc.com/gx/en/legal-notices/pwc-privacy-statement.html" target="_blank" className="hover:text-gray-300">
                        Privacy
                    </a>
                    <a href="https://www.pwc.com/gx/en/legal-notices/terms-and-conditions.html" target="_blank" className="hover:text-gray-300">
                        Terms and conditions
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;