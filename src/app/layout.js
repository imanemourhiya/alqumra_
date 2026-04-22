import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Al Qumra",
  description: "Réservation de tickets de cinéma en ligne",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Navbar />
        <Footer />
      </body>
      
    </html>
  );
}