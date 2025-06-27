
export default function Footer() {
  return (
    <footer className="bg-[--bg-secondary] text-[--text-muted] py-8 border-t border-[--border] mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} SmartRent. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Engineered by SamPro Media.
        </p>
        {/* Social links can be added here if desired, matching landing page style */}
      </div>
    </footer>
  );
}
