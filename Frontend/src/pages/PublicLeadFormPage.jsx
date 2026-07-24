import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Globe,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { leadApi } from "../api/leadApi.js";
import Button from "../components/common/Button.jsx";
import Input from "../components/common/Input.jsx";
import Select from "../components/common/Select.jsx";
import Textarea from "../components/common/Textarea.jsx";
import Toast from "../components/common/Toast.jsx";
import Footer from "../components/layout/Footer.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import { PUBLIC_SOURCES, SERVICE_OPTIONS } from "../utils/constants.js";
import { getApiError } from "../utils/getApiError.js";

const servicesList = [
  {
    number: "01",
    title: "Web Development",
    description: "Custom websites and modern web applications built for speed, conversion, and performance.",
    icon: Globe,
  },
  {
    number: "02",
    title: "Software & SaaS",
    description: "Custom software, SaaS platforms, CRM workflows, and modern business systems.",
    icon: Cpu,
  },
  {
    number: "03",
    title: "UI/UX & Brand",
    description: "Product experiences, intuitive user interfaces, and distinctive brand identities.",
    icon: Palette,
  },
  {
    number: "04",
    title: "Ecommerce",
    description: "Shopify platforms, custom ecommerce stores, and modern commerce experiences.",
    icon: ShoppingBag,
  },
  {
    number: "05",
    title: "Mobile Apps",
    description: "Modern native and cross-platform mobile experiences for iOS and Android.",
    icon: Smartphone,
  },
  {
    number: "06",
    title: "Growth",
    description: "Growth strategy, SEO optimization, and data-driven customer acquisition.",
    icon: TrendingUp,
  },
];

const workflowSteps = [
  {
    number: "01",
    title: "CAPTURE",
    description: "Share your project requirements through our quick project enquiry form.",
  },
  {
    number: "02",
    title: "REVIEW",
    description: "The Digital Heroes team reviews your submission and project scope.",
  },
  {
    number: "03",
    title: "CONNECT",
    description: "The right specialist team member reaches out to discuss details.",
  },
  {
    number: "04",
    title: "BUILD",
    description: "The conversation moves forward toward the right technical solution.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const PublicLeadFormPage = () => {
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState("");
  const location = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "Web Development",
      source: "website",
      message: "",
    },
  });

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  const onSubmit = async (values) => {
    setApiError("");
    try {
      await leadApi.createLead(values);
      setSuccess(true);
      setToast("Enquiry submitted successfully!");
      reset();
    } catch (error) {
      setApiError(getApiError(error, "We couldn't submit your enquiry. Please try again."));
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="soft-grid min-h-screen text-[var(--text-primary)] flex flex-col justify-between">
      <div>
        {/* Reusable Navbar with Dashboard & Start Project CTA */}
        <Navbar onScrollToSection={scrollToSection} />

        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-brand)] bg-white px-3.5 py-1 text-xs font-bold tracking-wider text-[var(--brand)] uppercase shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
              LEADFLOW · DIGITAL HEROES
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-6xl lg:text-7xl leading-tight">
              Turn ideas into opportunities.
            </h1>

            <p className="mt-6 text-lg leading-8 text-[var(--text-secondary)] sm:text-xl">
              Share your project requirements with the Digital Heroes team while LeadFlow helps capture, organize, and manage every qualified opportunity with clarity.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("start-project")}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[var(--brand-hover)] transition cursor-pointer hover:shadow-md"
              >
                Start a Project <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-white px-6 py-3 text-base font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-muted)] transition"
              >
                Team Sign In
              </Link>
            </div>

            {/* Lifecycle Pipeline Indicator */}
            <div className="mt-14 pt-8 border-t border-[var(--border-default)] grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "CAPTURE", desc: "Public Form" },
                { label: "ASSIGN", desc: "Admin Routing" },
                { label: "FOLLOW UP", desc: "Member Action" },
                { label: "CLOSE", desc: "Pipeline Progress" },
              ].map((step, idx) => (
                <div key={step.label} className="rounded-xl border border-[var(--border-default)] bg-white/80 p-3.5 text-center sm:text-left shadow-xs">
                  <span className="text-[10px] font-bold text-[var(--brand)] tracking-wider">0{idx + 1} — {step.label}</span>
                  <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[var(--border-default)]">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Capabilities</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              What can we build together?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {servicesList.map(({ number, title, description, icon: Icon }, index) => (
              <motion.div
                key={number}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                className="panel group relative p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white border border-[var(--border-default)] rounded-[var(--radius-lg)]"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[var(--brand)] tracking-wider">{number}</span>
                  <div className="p-2.5 rounded-full bg-[var(--surface-muted)] group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand)] transition">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition flex items-center justify-between">
                  {title}
                  <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition text-[var(--brand)]" />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[var(--border-default)]">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Process</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              From enquiry to opportunity.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.number}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={cardVariants}
                className="panel p-6 bg-white relative border border-[var(--border-default)] rounded-[var(--radius-lg)] shadow-xs"
              >
                <span className="text-3xl font-extrabold text-[var(--brand-secondary)]/40 block mb-2">{step.number}</span>
                <h3 className="text-base font-bold tracking-wide text-[var(--brand)] uppercase mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* START A PROJECT / LEAD FORM */}
        <section id="start-project" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-[var(--border-default)]">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="inline-block rounded-full bg-[var(--brand-soft)] px-3.5 py-1 text-xs font-bold text-[var(--brand)] uppercase tracking-wider mb-4 shadow-xs">
                Main Conversion Form
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl">
                Have a project in mind?
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
                Tell us what you're building. We'll take it from here. Your enquiry will be logged into LeadFlow and routed to the right Digital Heroes team member.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[var(--brand)] shrink-0" />
                  <span className="text-sm font-medium">Direct routing to digital product specialists</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[var(--brand)] shrink-0" />
                  <span className="text-sm font-medium">Prompt follow-up with clear scope guidance</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="panel p-6 sm:p-8 bg-white border-2 border-[var(--brand-secondary)]/30 rounded-[var(--radius-xl)] shadow-lg"
            >
              {success ? (
                <div className="mb-6 rounded-[var(--radius-lg)] border border-[var(--border-brand)] bg-[var(--brand-soft)] p-5 animate-in">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-[var(--success)] mt-0.5" aria-hidden="true" />
                    <div>
                      <h3 className="font-bold text-[var(--text-primary)]">Enquiry Received</h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Thank you! Your project enquiry has been submitted. Our team will review your requirements and get in touch shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => setSuccess(false)}
                        className="mt-4 text-xs font-semibold text-[var(--brand)] hover:underline cursor-pointer"
                      >
                        Submit another enquiry
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand)]">Project Details</p>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">Submit your enquiry</h3>
              </div>

              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                  label="Name *"
                  placeholder="Alex Morgan"
                  error={errors.name?.message}
                  {...register("name", { required: "Name is required" })}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="alex@example.com"
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
                  })}
                />
                <Input
                  label="Phone *"
                  placeholder="+91 9999999999"
                  error={errors.phone?.message}
                  {...register("phone", { required: "Phone number is required" })}
                />
                <Input
                  label="Company *"
                  placeholder="Acme Corp"
                  error={errors.company?.message}
                  {...register("company", { required: "Company name is required" })}
                />

                <Select
                  label="Service *"
                  error={errors.service?.message}
                  {...register("service", { required: "Service is required" })}
                >
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Source *"
                  error={errors.source?.message}
                  {...register("source", { required: "Lead source is required" })}
                >
                  {PUBLIC_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </Select>

                <div className="sm:col-span-2">
                  <Textarea
                    label="Project Message *"
                    placeholder="Tell us briefly about your goals, timelines, or requirements..."
                    error={errors.message?.message}
                    {...register("message", { required: "Project message details are required" })}
                  />
                </div>

                {apiError ? (
                  <div className="sm:col-span-2 rounded-[var(--radius-md)] bg-[var(--danger-soft)] p-3 text-sm font-medium text-[var(--danger)]">
                    {apiError}
                  </div>
                ) : null}

                <div className="sm:col-span-2">
                  <Button className="w-full sm:w-auto" type="submit" loading={isSubmitting}>
                    Submit Project Enquiry
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* TEAM PORTAL CTA */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-[var(--border-default)]">
          <div className="panel p-6 sm:p-8 bg-white text-black flex flex-col md:flex-row items-center justify-between gap-6 rounded-[var(--radius-xl)] border border-[var(--border-default)] shadow-md">
            <div>
              <h3 className="text-xl font-bold text-black">Already part of the team?</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Access your LeadFlow workspace to manage opportunities and follow-ups.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
              <Link
                to="/login"
                className="inline-flex justify-center items-center rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-hover)] transition w-full sm:w-auto shadow-xs"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex justify-center items-center rounded-full border border-[var(--border-default)] bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-[var(--surface-muted)] transition w-full sm:w-auto"
              >
                Create Member Account
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Reusable Multi-Column Footer */}
      <Footer />

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
};

export default PublicLeadFormPage;
