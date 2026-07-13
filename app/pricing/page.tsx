"use client";

import { StripeCheckoutApiCall } from "@/lib/api-calls/stripe-checkout-api-call";
import { repository } from "@/lib/database/repository";
import { useState, useEffect } from "react";

const plans = [
  {
    name: "Starter",
    price: "$9/month",
    priceId: "price_starter_id",

    features: ["5 Projects", "Basic Support", "Community Access"],
  },

  {
    name: "Pro",
    price: "$29/month",
    priceId: "price_pro_id",

    features: ["Unlimited Projects", "Priority Support", "Advanced Analytics"],
  },

  {
    name: "Business",
    price: "$99/month",
    priceId: "price_business_id",

    features: ["Everything in Pro", "Team Members", "Dedicated Support"],
  },
];

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState<string | null>(null);

  // Fetch plans from Firestore on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/getPlans");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        console.log("Fetched plans:", data);
        setPlans(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    fetchData();
  }, []);

  async function handleSubscribe(priceId: string) {
    
    setLoading(priceId);
    try {
      await StripeCheckoutApiCall("/api/stripe/checkout", priceId);
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="min-h-screen bg-black py-20 text-white">
      <div className="flex gap-6 overflow-x-auto px-6">
        {plans.map((plan: any) => (
          <div
            key={plan.id}
            className="min-w-[300px] border border-[#1A1A0A] rounded-2xl p-8 bg-[#0A0A0A]"
          >
            <h2 className="text-2xl font-bold">{plan.name}</h2>

            <p className="text-4xl font-bold mt-4 text-[#fcc875]">
              £{(plan.amount / 100).toFixed(2)}
            </p>

            <p className="text-gray-400 mt-2">{plan.description}</p>

            <ul className="mt-6 space-y-3">
              {plan.features?.map((feature: string) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.stripePriceId)}
              className="mt-8 w-full rounded-full bg-[#fcc875] text-black py-3 font-semibold hover:bg-white transition"
            >
              {loading === plan.stripePriceId ? "Loading..." : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// export default function Pricing() {
//   const [loading, setLoading] = useState<string | null>(null);

//   async function handleSubscribe(priceId: string | null) {
//     setLoading(priceId);
//     try {
//       await StripeCheckoutApiCall("/api/stripe/checkout", priceId!);
//     } catch (error) {
//       console.error("Subscription error:", error);
//       alert("Failed to start checkout. Please try again.");
//     } finally {
//       setLoading(null);
//     }
//   }

//   return (
//     <section className="min-h-screen bg-black py-20 text-white">
//       <div className="max-w-6xl mx-auto px-6">
//         <h1 className="text-5xl font-bold text-center">Choose Your Plan</h1>

//         <p className="text-center text-gray-400 mt-4">
//           Upgrade your SaaS experience
//         </p>

//         <div className="grid md:grid-cols-3 gap-8 mt-12">
//           {plans.map((plan) => (
//             <div
//               key={plan.name}
//               className="
// border border-[#1A1A1A]
// rounded-2xl
// p-8
// bg-[#0A0A0A]
// "
//             >
//               <h2 className="text-2xl font-bold">{plan.name}</h2>

//               <p className="text-4xl font-bold mt-4 text-[#fcc875]">
//                 {plan.price}
//               </p>

//               <ul className="mt-6 space-y-3">
//                 {plan.features.map((item) => (
//                   <li key={item}>✓ {item}</li>
//                 ))}
//               </ul>

//               <button
//                 onClick={() =>
//                   handleSubscribe("price_1Td7erD0vTr3liAbgEq4F2re")
//                 }
//                 className="
// mt-8
// w-full
// rounded-full
// bg-[#fcc875]
// text-black
// py-3
// font-semibold
// hover:bg-white
// transition
// "
//               >
//                 {loading === plan.priceId ? "Loading..." : "Subscribe"}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
