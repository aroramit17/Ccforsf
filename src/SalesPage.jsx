import { useState, useEffect, useRef } from "react";

const COLORS = {
  sfBlue: "#0176D3",
  sfBlueDark: "#014486",
  coral: "#DA7756",
  coralHover: "#C4613F",
  charcoal: "#12122A",
  heroGrad1: "#0B0B1E",
  heroGrad2: "#0D1B3E",
  cloudGray: "#F4F6F9",
  white: "#FFFFFF",
  textPrimary: "#181818",
  textSecondary: "#5A6A7B",
  terminal: "#1E1E2E",
  green: "#04844B",
  border: "#E5E9F0",
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Section({ bg, children, id, style = {} }) {
  const [ref, visible] = useInView(0.08);
  return (
    <section
      ref={ref}
      id={id}
      style={{
        background: bg || COLORS.white,
        padding: "72px 20px",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        ...style,
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 2.5,
        color: COLORS.sfBlue,
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}

function H2({ children, center }) {
  return (
    <h2
      style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontSize: "clamp(26px, 5vw, 36px)",
        fontWeight: 800,
        color: COLORS.textPrimary,
        lineHeight: 1.2,
        marginBottom: 20,
        textAlign: center ? "center" : "left",
        letterSpacing: -0.5,
      }}
    >
      {children}
    </h2>
  );
}

function BodyP({ children }) {
  return (
    <p
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 16,
        lineHeight: 1.7,
        color: COLORS.textSecondary,
        marginBottom: 16,
      }}
    >
      {children}
    </p>
  );
}

function CTAButton({ children, large, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: large ? "18px 40px" : "14px 32px",
        background: hover ? COLORS.coralHover : COLORS.coral,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontSize: large ? 17 : 15,
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover
          ? `0 8px 30px ${COLORS.coral}44`
          : `0 4px 16px ${COLORS.coral}33`,
        letterSpacing: 0.3,
      }}
    >
      {children} <span style={{ fontSize: large ? 20 : 17 }}>→</span>
    </button>
  );
}

function CheckItem({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 14,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          minWidth: 22,
          height: 22,
          borderRadius: 6,
          background: `${COLORS.green}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <span style={{ color: COLORS.green, fontSize: 14, fontWeight: 700 }}>
          ✓
        </span>
      </div>
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          lineHeight: 1.6,
          color: COLORS.textPrimary,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function PainItem({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        marginBottom: 18,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          minWidth: 6,
          height: 6,
          borderRadius: "50%",
          background: COLORS.coral,
          marginTop: 10,
        }}
      />
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 15,
          lineHeight: 1.7,
          color: COLORS.textSecondary,
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

function TestimonialCard({ name, role, quote }) {
  return (
    <div
      style={{
        background: COLORS.white,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          lineHeight: 1.7,
          color: COLORS.textSecondary,
          margin: 0,
          fontStyle: "italic",
        }}
      >
        "{quote}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.sfBlue}30, ${COLORS.coral}30)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: COLORS.sfBlue,
            }}
          >
            {name[0]}
          </span>
        </div>
        <div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 600,
              color: COLORS.textPrimary,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: COLORS.textSecondary,
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: `1px solid ${COLORS.border}`,
        cursor: "pointer",
      }}
      onClick={() => setOpen(!open)}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 0",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 15,
            fontWeight: 600,
            color: COLORS.textPrimary,
            paddingRight: 16,
          }}
        >
          {q}
        </span>
        <span
          style={{
            fontSize: 20,
            color: COLORS.sfBlue,
            fontWeight: 300,
            transition: "transform 0.3s",
            transform: open ? "rotate(45deg)" : "rotate(0)",
          }}
        >
          +
        </span>
      </div>
      <div
        style={{
          maxHeight: open ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: COLORS.textSecondary,
            lineHeight: 1.7,
            margin: "0 0 18px",
            paddingRight: 40,
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function SalesPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div
      style={{ background: COLORS.white, minHeight: "100vh", overflowX: "hidden" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* NAV */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 20px",
          background:
            scrollY > 50 ? "rgba(11,11,30,0.95)" : "transparent",
          backdropFilter: scrollY > 50 ? "blur(12px)" : "none",
          transition: "all 0.4s ease",
          borderBottom:
            scrollY > 50 ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 56,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 15,
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: 0.5,
            }}
          >
            <span style={{ color: COLORS.coral }}>cc</span>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>_</span>
            <span style={{ color: "rgba(255,255,255,0.5)" }}>for</span>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>_</span>
            <span style={{ color: COLORS.sfBlue }}>sf</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>__c</span>
          </div>
          <CTAButton>Get Access</CTAButton>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          background: `linear-gradient(160deg, ${COLORS.heroGrad1} 0%, ${COLORS.heroGrad2} 50%, #0D2847 100%)`,
          padding: "140px 20px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "-5%",
            width: 400,
            height: 400,
            background: `radial-gradient(circle, ${COLORS.sfBlue}22 0%, transparent 70%)`,
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "-5%",
            width: 300,
            height: 300,
            background: `radial-gradient(circle, ${COLORS.coral}18 0%, transparent 70%)`,
            borderRadius: "50%",
            filter: "blur(50px)",
          }}
        />

        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 3,
              color: COLORS.coral,
              marginBottom: 20,
              opacity: 0.9,
            }}
          >
            CLAUDE CODE x SALESFORCE
          </div>
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(32px, 6.5vw, 52px)",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: -1,
              maxWidth: 680,
            }}
          >
            Salesforce admins just got a superpower.
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(16px, 2.5vw, 19px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              maxWidth: 560,
              marginBottom: 12,
            }}
          >
            What are you going to do with all that free time?
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(15px, 2vw, 17px)",
              color: "rgba(255,255,255,0.4)",
              lineHeight: 1.6,
              maxWidth: 540,
              marginBottom: 36,
            }}
          >
            Side hustle. More time with family. Both. This course shows you
            how to use Claude Code to build Flows, create fields, write Apex,
            and deploy it all from your terminal. No coding background needed.
          </p>
          <CTAButton large>Get Instant Access - $97</CTAButton>
          <div
            style={{ marginTop: 24, display: "flex", gap: 20, flexWrap: "wrap" }}
          >
            {[
              "Video modules",
              "Instant access",
              "Lifetime updates",
              "7-day guarantee",
            ].map((t, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: COLORS.coral,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <Section bg={COLORS.white}>
        <SectionLabel>The Problem</SectionLabel>
        <H2>You know Salesforce. You just can't move fast enough.</H2>
        <PainItem>
          <strong style={{ color: COLORS.textPrimary }}>
            Creating a custom field
          </strong>{" "}
          used to mean 15 clicks. Then you had to add it to the page layout.
          Then the permission set. Then the profile. For one field.
        </PainItem>
        <PainItem>
          <strong style={{ color: COLORS.textPrimary }}>
            Need a new validation rule?
          </strong>{" "}
          You know exactly what it should do. But you're still Googling the
          syntax, testing in sandbox, and hoping you didn't break something.
        </PainItem>
        <PainItem>
          <strong style={{ color: COLORS.textPrimary }}>
            Waiting on developers
          </strong>{" "}
          for things you could spec out yourself is frustrating. You know the
          business logic better than anyone. You just can't write the code.
        </PainItem>
        <PainItem>
          <strong style={{ color: COLORS.textPrimary }}>
            Your backlog keeps growing
          </strong>{" "}
          and leadership keeps asking what's taking so long. Meanwhile the
          admin down the hall who figured out AI tools is shipping twice as
          fast.
        </PainItem>
      </Section>

      {/* AGITATE */}
      <Section bg={COLORS.cloudGray}>
        <SectionLabel>Sound Familiar?</SectionLabel>
        <H2>I used to be scared of Flows.</H2>
        <BodyP>
          Real talk. Flows terrified me. The canvas, the decision elements,
          the loops. I'd stare at it for 20 minutes and still not know where
          to start.
        </BodyP>
        <BodyP>
          Then LLMs came along and I thought okay, this changes everything.
          And it did help. I could ask ChatGPT how to build a flow and get
          step-by-step directions.
        </BodyP>
        <BodyP>
          But here's the thing nobody talks about. Reading those directions,
          building it click by click, troubleshooting when something
          broke... that still took hours. I was getting the right answers. I
          just couldn't move fast enough to implement them.
        </BodyP>
        <div
          style={{
            background: COLORS.white,
            borderRadius: 12,
            padding: "24px 28px",
            borderLeft: `3px solid ${COLORS.coral}`,
            marginTop: 24,
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
              color: COLORS.textPrimary,
              margin: 0,
              fontWeight: 500,
            }}
          >
            Now I just tell Claude to build the flow. It goes into my org, creates
            it, and deploys it. All I do is go check that it works. What used
            to take me an afternoon takes 5 minutes.
          </p>
        </div>
      </Section>

      {/* PERSUADE - Demo */}
      <Section bg={COLORS.white}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SectionLabel>See It In Action</SectionLabel>
          <H2 center>One prompt. Deployed to your org.</H2>
        </div>

        {/* Terminal mockup - the prompt */}
        <div
          style={{
            background: COLORS.terminal,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              gap: 6,
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FF5F57",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FEBC2E",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#28C840",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                marginLeft: 10,
              }}
            >
              claude code
            </span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                lineHeight: 2,
              }}
            >
              <span style={{ color: COLORS.coral }}>❯</span>{" "}
              <span style={{ color: "#A5D6FF" }}>
                "Create a screen flow for the Opportunity object.
              </span>
              <br />
              <span style={{ color: "#A5D6FF" }}>
                {"  "}When a user clicks a button, open a flow that captures
              </span>
              <br />
              <span style={{ color: "#A5D6FF" }}>
                {"  "}first name, last name, and email. Auto-populate the
              </span>
              <br />
              <span style={{ color: "#A5D6FF" }}>
                {"  "}account name from the opportunity. Create the contact,
              </span>
              <br />
              <span style={{ color: "#A5D6FF" }}>
                {"  "}link it to the account, and add a contact role on
              </span>
              <br />
              <span style={{ color: "#A5D6FF" }}>
                {"  "}the opportunity."
              </span>
              <br />
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                I'll create the screen flow and a quick action button to
                launch it from the Opportunity page.
              </span>
            </div>
          </div>
        </div>

        {/* Terminal mockup - the output */}
        <div
          style={{
            background: COLORS.terminal,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              background: "rgba(255,255,255,0.03)",
              display: "flex",
              gap: 6,
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FF5F57",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FEBC2E",
              }}
            />
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#28C840",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.3)",
                marginLeft: 10,
              }}
            >
              4m 33s later...
            </span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                lineHeight: 1.9,
              }}
            >
              <span style={{ color: COLORS.green }}>✓</span>{" "}
              <span style={{ color: "#E2E8F0" }}>
                Everything deployed successfully.
              </span>
              <br />
              <br />
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                Flow:{" "}
              </span>
              <span style={{ color: "#E2E8F0" }}>
                Add_Contact_to_Opportunity
              </span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {"  "}1. Get Opportunity → Account Name + Account ID
              </span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {"  "}2. Screen → First Name, Last Name, Email
              </span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {"  "}3. Create Contact → linked to Account
              </span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {"  "}4. Create Contact Role → on Opportunity
              </span>
              <br />
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {"  "}5. Success Screen → confirmation
              </span>
              <br />
              <br />
              <span style={{ color: COLORS.green }}>✓</span>{" "}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                LWC wrapper created
              </span>
              <br />
              <span style={{ color: COLORS.green }}>✓</span>{" "}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                Quick Action deployed to Opportunity
              </span>
              <br />
              <span style={{ color: COLORS.green }}>✓</span>{" "}
              <span style={{ color: "rgba(255,255,255,0.6)" }}>
                Ready to use on the record page
              </span>
            </div>
          </div>
        </div>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#94A3B8",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          A screen flow, an LWC wrapper, and a quick action. Deployed.
          Under 5 minutes. From one prompt.
        </p>
      </Section>

      {/* PERSUADE - Before / After */}
      <Section bg={COLORS.cloudGray}>
        <SectionLabel>What Changes</SectionLabel>
        <H2>Things you'll stop doing.</H2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: 1.5,
                marginBottom: 16,
              }}
            >
              BEFORE
            </div>
            {[
              "15 clicks to create one field",
              "Manually updating permission sets",
              "Googling validation rule syntax",
              "Waiting 2 weeks for a developer",
              "Building flows click by click",
              "Reading docs and hoping it works",
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#B0B8C4", fontSize: 14 }}>✗</span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: "#94A3B8",
                    lineHeight: 1.5,
                  }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: 24,
              border: `2px solid ${COLORS.sfBlue}33`,
              boxShadow: `0 8px 30px ${COLORS.sfBlue}08`,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.sfBlue,
                letterSpacing: 1.5,
                marginBottom: 16,
              }}
            >
              AFTER
            </div>
            {[
              '"Create a picklist field on Contact called Lead Source Detail"',
              '"Add it to the Sales Console page layout and the SDR permission set"',
              '"Write a validation rule that requires it when Status is Qualified"',
              '"Build me a flow that assigns leads by region"',
              '"Deploy all of it to my org"',
              "Go grab coffee. Come back. Check that it works.",
            ].map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <span
                  style={{ color: COLORS.green, fontSize: 14, fontWeight: 700 }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: COLORS.textPrimary,
                    lineHeight: 1.5,
                  }}
                >
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* PERSUADE - What you get */}
      <Section bg={COLORS.white}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>What You Get</SectionLabel>
          <H2 center>Everything you need to start using Claude Code with Salesforce.</H2>
        </div>
        <div style={{ marginBottom: 32 }}>
          <CheckItem>
            How to install Claude Code and connect it to your Salesforce org
            (even if you've never used a terminal)
          </CheckItem>
          <CheckItem>
            Creating fields, page layouts, and permission sets with a single
            prompt
          </CheckItem>
          <CheckItem>
            Building Flows from plain English descriptions and deploying them
            directly
          </CheckItem>
          <CheckItem>
            Writing validation rules and Apex triggers without knowing the
            syntax
          </CheckItem>
          <CheckItem>
            What to do when Claude gets it wrong (it will) and how to get it
            back on track
          </CheckItem>
          <CheckItem>
            Real prompts from my actual Salesforce org that you can copy and
            adapt
          </CheckItem>
        </div>
        <div
          style={{
            background: COLORS.cloudGray,
            borderRadius: 12,
            padding: "24px 28px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: COLORS.textSecondary,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Video modules with lifetime access. Instant access after purchase.
            All future updates included.
          </p>
        </div>
      </Section>

      {/* SOCIAL PROOF */}
      <Section bg={COLORS.cloudGray}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SectionLabel>Early Reactions</SectionLabel>
          <H2 center>What people are saying.</H2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <TestimonialCard
            name="Sarah K."
            role="Salesforce Admin, Series B SaaS"
            quote="I built a lead routing flow in 10 minutes that would have taken me an entire afternoon. I keep looking for the catch."
          />
          <TestimonialCard
            name="Marcus T."
            role="Sr. Admin, Healthcare"
            quote="I've been an admin for 6 years and never touched a terminal. Did the setup in module 1 and had my first flow deployed before lunch."
          />
          <TestimonialCard
            name="Priya R."
            role="RevOps Lead, FinTech"
            quote="Showed my VP the before and after. We cancelled the Agentforce eval the same week."
          />
        </div>
      </Section>

      {/* THE MATH */}
      <Section bg={COLORS.white}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <SectionLabel>The Math</SectionLabel>
          <H2 center>You're already paying more than this in wasted time.</H2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          <div
            style={{
              background: COLORS.cloudGray,
              borderRadius: 12,
              padding: 28,
              border: `1px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: 1.5,
                marginBottom: 20,
              }}
            >
              THE OLD WAY
            </div>
            {[
              ["Agentforce license", "$125-$550/mo"],
              ["Implementation partner", "$50K-$150K"],
              ["Time to first automation", "8-12 weeks"],
              ["Who owns it?", "IT + vendor"],
            ].map(([k, v], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: COLORS.textSecondary,
                  }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#94A3B8",
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              background: COLORS.white,
              borderRadius: 12,
              padding: 28,
              border: `2px solid ${COLORS.sfBlue}33`,
              boxShadow: `0 8px 30px ${COLORS.sfBlue}08`,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: COLORS.sfBlue,
                letterSpacing: 1.5,
                marginBottom: 20,
              }}
            >
              WITH CLAUDE CODE
            </div>
            {[
              ["Claude subscription", "$17/mo"],
              ["This course", "$97 once"],
              ["Time to first automation", "Under an hour"],
              ["Who owns it?", "You"],
            ].map(([k, v], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: `1px solid ${COLORS.border}`,
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 14,
                    color: COLORS.textPrimary,
                  }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    color: COLORS.sfBlue,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* WHO THIS IS FOR */}
      <Section bg={COLORS.cloudGray}>
        <SectionLabel>Is This For You?</SectionLabel>
        <H2>This is for you if...</H2>
        <div style={{ marginBottom: 28 }}>
          <CheckItem>
            You're a Salesforce admin who knows the platform but wants to move
            faster
          </CheckItem>
          <CheckItem>
            You've heard about Claude Code but have no idea where to start
          </CheckItem>
          <CheckItem>
            You're tired of filing tickets and waiting for devs to build what
            you already know how to spec
          </CheckItem>
          <CheckItem>
            You've never opened a terminal and that's fine
          </CheckItem>
          <CheckItem>
            You want to be the person on your team who figured this out first
          </CheckItem>
        </div>
        <div
          style={{
            padding: "20px 24px",
            background: COLORS.white,
            borderRadius: 10,
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#94A3B8",
              marginBottom: 10,
            }}
          >
            Probably not for you if:
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 8,
              alignItems: "center",
            }}
          >
            <span style={{ color: "#B0B8C4", fontSize: 14 }}>✗</span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#94A3B8",
              }}
            >
              You're already a Salesforce developer using VS Code daily
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 8,
              alignItems: "center",
            }}
          >
            <span style={{ color: "#B0B8C4", fontSize: 14 }}>✗</span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#94A3B8",
              }}
            >
              You're looking for cert prep (this is practical, not exam study)
            </span>
          </div>
        </div>
      </Section>

      {/* INSTRUCTOR */}
      <Section bg={COLORS.white}>
        <SectionLabel>Your Instructor</SectionLabel>
        <div
          style={{
            display: "flex",
            gap: 24,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${COLORS.sfBlue}, ${COLORS.coral})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 32,
                color: "#fff",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
              }}
            >
              A
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: COLORS.textPrimary,
                marginBottom: 4,
              }}
            >
              Amit
            </h3>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: COLORS.sfBlue,
                marginBottom: 14,
              }}
            >
              GTM Engineer · Salesforce Admin · AI Tools Builder
            </p>
            <BodyP>
              I've spent years in the Salesforce ecosystem doing RevOps,
              sales operations, and CRM architecture. I was the admin who was
              scared of Flows. When Claude Code came out, everything changed.
              I went from filing Jira tickets and waiting two weeks to just...
              building the thing myself. This course is everything I wish
              someone had shown me on day one.
            </BodyP>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section bg={COLORS.cloudGray}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <SectionLabel>FAQ</SectionLabel>
          <H2 center>Common questions.</H2>
        </div>
        <FAQItem
          q="Do I need to know how to code?"
          a="No. The whole course assumes zero coding background. Claude Code writes the code. You describe what you want in plain English."
        />
        <FAQItem
          q="What do I need to get started?"
          a="A Claude Pro subscription ($17/month) and a Salesforce org that supports Salesforce DX (Enterprise, Unlimited, or Developer edition). The course walks you through everything."
        />
        <FAQItem
          q="How is this different from Agentforce?"
          a="Agentforce is a Salesforce product that costs $125-$550/user/month plus implementation. Claude Code is a $17/month AI tool from Anthropic that connects to your org. No Salesforce add-on license needed."
        />
        <FAQItem
          q="How long do I have access?"
          a="Lifetime. Watch it once, come back anytime. All future updates are included."
        />
        <FAQItem
          q="What if I don't like it?"
          a="Full refund within 7 days. No questions asked."
        />
        <FAQItem
          q="Is this affiliated with Salesforce or Anthropic?"
          a="No. This is an independent course. Salesforce and Claude are trademarks of their respective companies."
        />
      </Section>

      {/* FINAL CTA */}
      <section
        style={{
          background: `linear-gradient(160deg, ${COLORS.heroGrad1} 0%, ${COLORS.heroGrad2} 50%, #0D2847 100%)`,
          padding: "80px 20px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            height: 500,
            background: `radial-gradient(circle, ${COLORS.coral}12 0%, transparent 60%)`,
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h2
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: -0.5,
            }}
          >
            Stop clicking. Start prompting.
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.6,
              marginBottom: 32,
            }}
          >
            $97 one-time. Lifetime access. 7-day money-back guarantee.
          </p>
          <CTAButton large>Get Instant Access - $97</CTAButton>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              marginTop: 20,
            }}
          >
            Secure checkout · Instant access · All future updates included
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          background: COLORS.charcoal,
          padding: "32px 20px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span style={{ color: COLORS.coral }}>cc</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>_</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>for</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>_</span>
            <span style={{ color: COLORS.sfBlue }}>sf</span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>__c</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Terms", "Privacy", "Refund Policy"].map((t, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.25)",
                  cursor: "pointer",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.15)",
            }}
          >
            © 2026 AI with Amit
          </span>
        </div>
      </footer>
    </div>
  );
}
