
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link'; // Import Next.js Link
import { cn } from '@/lib/utils'; // Make sure cn is imported

// Interfaces for component props (can be moved to a types file)
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  href: string;
  className?: string;
}

interface StepCardProps {
  icon: React.ReactNode;
  stepNumber: string;
  title: string;
  description: string;
  className?: string;
}


// Feature Card Component (defined within page.tsx for simplicity, can be moved)
function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  const iconElement = React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
    className: cn("h-8 w-8 text-accent group-hover:text-accent-light transition-colors duration-300", (icon as React.ReactElement<any>).props.className)
  }) : null;

  return (
    <div className={cn("feature-card p-6 rounded-xl glass-effect-light hover:shadow-accent-glow transition-all duration-300 transform hover:-translate-y-1", className)}>
      <div className="feature-icon-wrapper mb-4 p-3 bg-accent/10 rounded-lg inline-block group-hover:bg-accent/20 transition-colors duration-300">
        {iconElement}
      </div>
      <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-accent transition-colors duration-300">{title}</h3>
      <p className="text-text-secondary text-base leading-relaxed">{description}</p>
    </div>
  );
}

// Role Card Component
function RoleCard({ icon, title, description, linkText, href, className }: RoleCardProps) {
    const iconElement = React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
        className: cn("h-10 w-10 text-accent mb-4", (icon as React.ReactElement<any>).props.className)
    }) : null;

    return (
        <div className={cn("role-card p-6 bg-background-secondary rounded-xl shadow-lg border border-border-subtle hover:border-accent transition-colors duration-300 flex flex-col", className)}>
            {iconElement}
            <h3 className="text-xl font-semibold mb-2 text-text-primary">{title}</h3>
            <p className="text-text-secondary text-sm flex-grow mb-4">{description}</p>
            <Link href={href} className="text-accent hover:text-accent-light font-medium text-sm self-start group">
                {linkText} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">&rarr;</span>
            </Link>
        </div>
    );
}

// Step Card Component
function StepCard({ icon, stepNumber, title, description, className }: StepCardProps) {
    const iconElement = React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
        className: cn("h-12 w-12 text-accent mb-3", (icon as React.ReactElement<any>).props.className)
    }) : null;

    return (
        <div className={cn("step-card p-6 bg-background-secondary rounded-xl shadow-md border border-border-subtle text-center", className)}>
            <div className="flex justify-center mb-3">{iconElement}</div>
            <span className="block text-sm font-semibold text-accent mb-1">{stepNumber}</span>
            <h3 className="text-lg font-semibold mb-2 text-text-primary">{title}</h3>
            <p className="text-text-secondary text-xs">{description}</p>
        </div>
    );
}


export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const currentNavRef = navRef.current;

    const handleScroll = () => {
      if (currentNavRef) {
        if (window.scrollY > 50) {
          currentNavRef.classList.add('scrolled');
        } else {
          currentNavRef.classList.remove('scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    const smoothScrollHandler = function (this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (isMobileMenuOpen && navLinksRef.current && mobileMenuBtnRef.current) {
            navLinksRef.current.classList.remove('active');
            const icon = mobileMenuBtnRef.current.querySelector('i');
            if (icon) {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
            }
            setIsMobileMenuOpen(false);
          }
        }
      } else if (targetId === "#") {
        // Smooth scroll to top if href is just "#"
        window.scrollTo({ top: 0, behavior: 'smooth' });
         if (isMobileMenuOpen && navLinksRef.current && mobileMenuBtnRef.current) {
            navLinksRef.current.classList.remove('active');
            const icon = mobileMenuBtnRef.current.querySelector('i');
            if (icon) {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
            }
            setIsMobileMenuOpen(false);
          }
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', smoothScrollHandler as EventListener);
    });

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('.hero-content, .feature-card, .role-card, .step-card, .about-text, .visual-card, .section-header, .footer-column, .footer-bottom').forEach(el => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(30px)';
      (el as HTMLElement).style.transition = 'opacity 0.8s cubic-bezier(0.645, 0.045, 0.355, 1), transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)';
      observer.observe(el);
    });

    // Typing animation for hero title
    const typeAnimate = (elementRef: React.RefObject<HTMLElement>, text: string, speed: number, callback?: () => void) => {
        if (elementRef.current) {
            const el = elementRef.current;
            el.innerHTML = ''; // Clear current content
            el.style.opacity = '1'; // Ensure it's visible
            let i = 0;
            const type = () => {
                if (i < text.length) {
                    const char = text.charAt(i);
                    if (char === '<') { // Handle HTML tags
                        const closingTagIndex = text.indexOf('>', i);
                        if (closingTagIndex !== -1) {
                            el.innerHTML += text.substring(i, closingTagIndex + 1);
                            i = closingTagIndex;
                        }
                    } else {
                        el.innerHTML += char;
                    }
                    i++;
                    setTimeout(type, speed);
                } else if (callback) {
                    callback();
                }
            };
            type();
        }
    };

    const heroTitleFullText = 'The Future of Property Management is <span class="text-accent">SmartRent</span>';
    const heroSubtitleFullText = heroSubtitleRef.current?.textContent || "";

    if (heroTitleRef.current) {
        heroTitleRef.current.style.opacity = '0'; // Hide initially
    }
    if (heroSubtitleRef.current) {
        heroSubtitleRef.current.style.opacity = '0'; // Hide initially
    }
    
    setTimeout(() => {
        typeAnimate(heroTitleRef, heroTitleFullText, 50, () => {
            setTimeout(() => {
                if(heroSubtitleRef.current) {
                    typeAnimate(heroSubtitleRef, heroSubtitleFullText, 20);
                }
            }, 300); // Delay before typing subtitle
        });
    }, 500); // Initial delay

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', smoothScrollHandler as EventListener);
      });
      observer.disconnect();
    };
  }, [isMobileMenuOpen]); // Include isMobileMenuOpen in dependencies

  const toggleMobileMenu = () => {
    if (navLinksRef.current && mobileMenuBtnRef.current) {
      const isActive = navLinksRef.current.classList.toggle('active');
      setIsMobileMenuOpen(isActive);
      const icon = mobileMenuBtnRef.current.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isActive);
        icon.classList.toggle('fa-times', isActive);
      }
    }
  };

  // Font Awesome icons directly in JSX
  const RocketIcon = () => <i className="fas fa-rocket"></i>;
  const CompassIcon = () => <i className="fas fa-compass"></i>;
  const BrainIcon = () => <i className="fas fa-brain"></i>;
  const UsersCogIcon = () => <i className="fas fa-users-cog"></i>;
  const ShieldCheckIcon = () => <i className="fas fa-shield-alt"></i>; // Using shield-alt for security
  const ChartPieIcon = () => <i className="fas fa-chart-pie"></i>;
  const UserTieIcon = () => <i className="fas fa-user-tie"></i>; // For Landlord
  const UserFriendsIcon = () => <i className="fas fa-user-friends"></i>; // For Tenant
  const HardHatIcon = () => <i className="fas fa-hard-hat"></i>; // For Worker
  const StoreIcon = () => <i className="fas fa-store"></i>; // For Shop Manager
  const SignUpIcon = () => <i className="fas fa-user-plus"></i>;
  const SelectIcon = () => <i className="fas fa-tasks"></i>;
  const RelaxIcon = () => <i className="fas fa-couch"></i>;


  return (
    <>
      {/* Navigation */}
      <nav id="navbar" ref={navRef} className="fixed top-0 left-0 right-0 z-[1000] py-3 transition-all duration-300 ease-in-out">
        <div className="nav-container container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link href="/" className="logo group">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent transition-transform duration-300 group-hover:rotate-[10deg]">
                <path d="M12 2L2 7V21H22V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 22V17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 13H7V10C7 8.89543 7.89543 8 9 8H15C16.1046 8 17 8.89543 17 10V13Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 6L9 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 6L15 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-extrabold tracking-tight">SmartRent</span>
          </Link>
          
          <div className="nav-links hidden md:flex items-center space-x-8" ref={navLinksRef}>
            <a href="#features" className="nav-link-item">Features</a>
            <a href="#platform" className="nav-link-item">Platform</a>
            <a href="#how-it-works" className="nav-link-item">How It Works</a>
            <a href="#about" className="nav-link-item">About</a>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/auth?tab=login" className="btn-nav-secondary hidden sm:inline-flex">Login</Link>
            <Link href="/auth?tab=register" className="btn-nav-primary hidden sm:inline-flex">
              Sign Up <span aria-hidden="true">&rarr;</span>
            </Link>
            <button className="mobile-menu-btn md:hidden" onClick={toggleMobileMenu} ref={mobileMenuBtnRef} aria-label="Toggle Menu" aria-expanded={isMobileMenuOpen}>
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
        {/* Mobile Menu Dropdown */}
        <div className={`nav-links-mobile md:hidden ${isMobileMenuOpen ? 'active' : ''}`} ref={navLinksRef}>
            <a href="#features" className="nav-link-item-mobile" onClick={toggleMobileMenu}>Features</a>
            <a href="#platform" className="nav-link-item-mobile" onClick={toggleMobileMenu}>Platform</a>
            <a href="#how-it-works" className="nav-link-item-mobile" onClick={toggleMobileMenu}>How It Works</a>
            <a href="#about" className="nav-link-item-mobile" onClick={toggleMobileMenu}>About</a>
            <div className="mt-4 pt-4 border-t border-border-subtle space-y-3">
                <Link href="/auth?tab=login" className="btn-nav-secondary w-full" onClick={toggleMobileMenu}>Login</Link>
                <Link href="/auth?tab=register" className="btn-nav-primary w-full" onClick={toggleMobileMenu}>Sign Up <span aria-hidden="true">&rarr;</span></Link>
            </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="hero relative overflow-hidden min-h-screen flex items-center py-20 md:py-32">
        <div className="floating-elements">
            <div className="floating-element"></div>
            <div className="floating-element"></div>
            <div className="floating-element"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="hero-content max-w-3xl mx-auto text-center">
            <h1 ref={heroTitleRef} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              The Future of Property Management is <span className="text-accent">SmartRent</span>
            </h1>
            <p ref={heroSubtitleRef} className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
              Streamline operations, enhance tenant experiences, and maximize profitability with our intelligent, all-in-one platform.
            </p>
            <div className="cta-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth?tab=register" className="btn btn-primary w-full sm:w-auto group">
                Get Started Free <RocketIcon />
              </Link>
              <a href="#features" className="btn btn-secondary w-full sm:w-auto group">
                <CompassIcon /> Learn More 
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features py-16 md:py-24 bg-background-primary" id="features">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header max-w-2xl mx-auto text-center mb-12 md:mb-16">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Why SmartRent?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4">Unlock Seamless Property Living</h2>
            <p className="text-md text-text-secondary">
              SmartRent offers a comprehensive suite of tools designed to simplify property management for everyone involved.
            </p>
          </div>
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<BrainIcon />} 
              title="AI-Powered Insights" 
              description="Automate routine tasks, gain predictive maintenance alerts, and optimize rental pricing with intelligent analytics."
            />
            <FeatureCard 
              icon={<UsersCogIcon />} 
              title="Unified Management" 
              description="One dashboard to manage properties, tenants, workers, finances, and communications effortlessly."
            />
            <FeatureCard 
              icon={<ShieldCheckIcon />} 
              title="Secure & Transparent" 
              description="Robust security for data and payments, with clear audit trails and transparent processes for all users."
            />
            <FeatureCard 
              icon={<ChartPieIcon />} 
              title="Growth Focused" 
              description="Tools designed to help you scale your property business, improve tenant retention, and boost your bottom line."
            />
          </div>
        </div>
      </section>

      {/* Platform for Everyone Section */}
      <section className="platform-roles py-16 md:py-24 bg-background-secondary" id="platform">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-header max-w-2xl mx-auto text-center mb-12 md:mb-16">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">A Platform for Everyone</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4">Tailored for Every Role</h2>
                <p className="text-md text-text-secondary">
                    SmartRent provides dedicated dashboards and features for Landlords, Tenants, Workers, and Shop Managers.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <RoleCard 
                    icon={<UserTieIcon/>} 
                    title="Landlords" 
                    description="Manage properties, track finances, oversee tenants and workers, and generate reports all from one powerful dashboard."
                    linkText="Explore Landlord Tools"
                    href="/auth?tab=register&role=landlord"
                />
                <RoleCard 
                    icon={<UserFriendsIcon/>} 
                    title="Tenants" 
                    description="Pay rent online, submit service requests, communicate with landlords, and access building information seamlessly."
                    linkText="Discover Tenant Portal"
                    href="/auth?tab=register&role=tenant"
                />
                <RoleCard 
                    icon={<HardHatIcon/>} 
                    title="Workers" 
                    description="View assigned tasks, update job statuses, manage schedules, and communicate progress efficiently."
                    linkText="See Worker Features"
                    href="/auth?tab=register&role=worker"
                />
                <RoleCard 
                    icon={<StoreIcon/>} 
                    title="Shop Managers" 
                    description="Manage local shop inventory, process orders from tenants, and track sales within the SmartRent ecosystem."
                    linkText="Check Out Shop Tools"
                    href="/auth?tab=register&role=shop_manager"
                />
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works py-16 md:py-24 bg-background-primary" id="how-it-works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="section-header max-w-2xl mx-auto text-center mb-12 md:mb-16">
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Get Started</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4">Three Simple Steps</h2>
                <p className="text-md text-text-secondary">
                    Joining SmartRent and transforming your property management is easy.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StepCard 
                    icon={<SignUpIcon/>} 
                    stepNumber="Step 1" 
                    title="Sign Up & Setup" 
                    description="Create your account, choose your role, and set up your initial property or profile details in minutes."
                />
                <StepCard 
                    icon={<SelectIcon/>} 
                    stepNumber="Step 2" 
                    title="Configure & Invite" 
                    description="Landlords add properties and invite tenants & workers. Others complete their profiles."
                />
                <StepCard 
                    icon={<RelaxIcon/>} 
                    stepNumber="Step 3" 
                    title="Manage & Thrive" 
                    description="Utilize your dedicated dashboard to streamline tasks, communicate, and enjoy smarter property living."
                />
            </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="about py-16 md:py-24 bg-background-secondary" id="about">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="about-content grid md:grid-cols-2 gap-12 items-center">
            <div className="about-text">
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Vision</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-6">Engineered by SamPro Media</h2>
              <p className="text-text-secondary mb-4 text-lg leading-relaxed">
                SmartRent is meticulously crafted by <span className="font-semibold text-text-primary">SamPro Media</span>, a digital innovation studio passionate about creating transformative technology solutions. We believe in the power of smart design and intelligent engineering to solve real-world problems.
              </p>
              <p className="text-text-secondary mb-6 text-md">
                Our mission is to empower property managers, landlords, tenants, and associated service providers with tools that are not only powerful but also intuitive and delightful to use. We&apos;re constantly exploring new frontiers in AI and user experience to ensure SmartRent remains at the forefront of property technology.
              </p>
              <Link href="https://sampro-media.vercel.app/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary group">
                Join Our Vision <RocketIcon />
              </Link>
            </div>
            <div className="about-visual relative h-80 md:h-96 flex items-center justify-center">
                <div className="visual-card">
                   {/* Content for visual-card, if any, or it's purely for background */}
                </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer py-16 bg-background-primary border-t border-border-subtle" id="contact">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="footer-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="footer-column">
              <h3 className="text-lg font-semibold mb-4 text-accent">SmartRent</h3>
              <ul className="footer-links space-y-2">
                <li><a href="#features" className="hover:text-accent-light transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-accent-light transition-colors">Pricing (Coming Soon)</a></li>
                <li><a href="/auth?tab=login" className="hover:text-accent-light transition-colors">Login</a></li>
                <li><a href="/auth?tab=register" className="hover:text-accent-light transition-colors">Register</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="text-lg font-semibold mb-4 text-accent">Resources</h3>
              <ul className="footer-links space-y-2">
                <li><a href="#" className="hover:text-accent-light transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent-light transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-accent-light transition-colors">API Status</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="text-lg font-semibold mb-4 text-accent">Company</h3>
              <ul className="footer-links space-y-2">
                <li><a href="#about" className="hover:text-accent-light transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-accent-light transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-accent-light transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent-light transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3 className="text-lg font-semibold mb-4 text-accent">Contact</h3>
              <ul className="footer-links space-y-2">
                <li><a href="mailto:support@smartrent.app" className="hover:text-accent-light transition-colors">support@smartrent.app</a></li>
                <li><a href="tel:+254712345678" className="hover:text-accent-light transition-colors">+254 712 345 678</a></li>
                <li className="text-text-muted">Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-subtle">
            <div className="copyright text-sm text-text-muted mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SmartRent. Crafted by SamPro Media.
            </div>
            <div className="social-links flex space-x-4">
              <a href="#" aria-label="Twitter" className="text-text-secondary hover:text-accent transition-colors"><i className="fab fa-twitter fa-lg"></i></a>
              <a href="#" aria-label="Facebook" className="text-text-secondary hover:text-accent transition-colors"><i className="fab fa-facebook-f fa-lg"></i></a>
              <a href="#" aria-label="Instagram" className="text-text-secondary hover:text-accent transition-colors"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#" aria-label="LinkedIn" className="text-text-secondary hover:text-accent transition-colors"><i className="fab fa-linkedin-in fa-lg"></i></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
