import React, { useState } from "react";
import { DollarSign, BookOpen, ExternalLink, ShieldCheck, TrendingUp, Sparkles, Sliders, CheckCircle2 } from "lucide-react";
import { NailCollection } from "../types";

interface MonetizationSuiteProps {
  collection: NailCollection;
  onSimulatePdfExport: () => void;
}

export const MonetizationSuite: React.FC<MonetizationSuiteProps> = ({
  collection,
  onSimulatePdfExport,
}) => {
  // Profit Estimator Slider States
  const [monthlyUsers, setMonthlyUsers] = useState<number>(5000);
  const [proConversionRate, setProConversionRate] = useState<number>(3.5); // percentage
  const [proPrice, setProPrice] = useState<number>(2.99); // USD
  const [affiliateSales, setAffiliateSales] = useState<number>(450); // polish bottles sold
  const [salonLeadFee, setSalonLeadFee] = useState<number>(5.00); // USD per lead
  const [bookedLeads, setBookedLeads] = useState<number>(120);

  // Math Calculations for Business Vibe
  const proMonthlyRevenue = Math.round(monthlyUsers * (proConversionRate / 100) * proPrice);
  const affiliateCommission = Math.round(affiliateSales * 0.80); // e.g. $0.80 commission per bottle
  const leadRevenue = Math.round(bookedLeads * salonLeadFee);
  const totalMonthlyRevenue = proMonthlyRevenue + affiliateCommission + leadRevenue;
  const cloudHostingCost = Math.round(80 + (monthlyUsers * 0.004)); // scalability cost
  const netProfit = totalMonthlyRevenue - cloudHostingCost;

  // Render matching polishes based on the generated design colors
  const getPolishMatches = () => {
    return collection.colorPalette.map((color, index) => {
      // Suggest realistic commercial brands
      const brands = ["OPI Infinite Shine", "Essie Gel Couture", "Sally Hansen Miracle Gel", "CND Vinylux"];
      const brand = brands[index % brands.length];

      // Format polish names elegantly
      let polishName = `${color.name} Luxe`;
      if (color.name.toLowerCase().includes("blush") || color.name.toLowerCase().includes("pink")) {
        polishName = `${color.name} (Match: Essie "Ballet Slippers")`;
      } else if (color.name.toLowerCase().includes("sage") || color.name.toLowerCase().includes("green")) {
        polishName = `${color.name} (Match: OPI "Sage Simulation")`;
      } else if (color.name.toLowerCase().includes("black") || color.name.toLowerCase().includes("obsidian")) {
        polishName = `${color.name} (Match: OPI "Lady in Black")`;
      } else if (color.name.toLowerCase().includes("vanilla") || color.name.toLowerCase().includes("white")) {
        polishName = `${color.name} (Match: Essie "Marshmallow")`;
      }

      return {
        brand,
        polishName,
        hex: color.hex,
        commission: "$0.85 (8% Affiliate fee)",
        affiliateLink: `https://www.amazon.com/s?k=${encodeURIComponent(brand + " " + color.name + " nail polish")}`,
      };
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-pink-100/50 space-y-8">
      {/* HEADER SECTION */}
      <div className="border-b border-pink-100 pb-5">
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 tracking-wider uppercase flex items-center gap-1.5 w-fit">
          <TrendingUp className="w-3.5 h-3.5" /> Founder's Monetization Suite
        </span>
        <h3 className="font-display text-2xl font-bold text-gray-800 mt-2">
          How to Monetize your AI Nail App
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Hello! Let's explore 4 distinct, highly profitable ways to make a living off this app as a beginner creator, complete with an interactive revenue simulator!
        </p>
      </div>

      {/* 4 CORE MONETIZATION MODELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model 1: Premium Recipes */}
        <div className="p-5 rounded-xl bg-gradient-to-tr from-pink-50/50 to-rose-50/20 border border-pink-100/40 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 bg-pink-100/80 px-2.5 py-1 rounded-bl-xl text-[10px] font-bold text-pink-700 tracking-wide uppercase">
            Model 1: micro-payment
          </div>
          <h4 className="font-display font-bold text-gray-800 text-base mb-1">
            Pro Salon Recipe Exports
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Charge users $0.99 per export or a $4.99/mo premium subscription to download a highly detailed "Salon Recipe Card" PDF. Technicians love these because they contain perfect hex colors, textures, cropped reference placements, and professional step-by-step notes.
          </p>
          <button
            onClick={onSimulatePdfExport}
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm"
          >
            ⭐ Try Premium Recipe Card Export (Free Simulation)
          </button>
        </div>

        {/* Model 2: Affiliate Matching */}
        <div className="p-5 rounded-xl bg-gradient-to-tr from-emerald-50/40 to-teal-50/10 border border-emerald-100/40 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 bg-emerald-100/80 px-2.5 py-1 rounded-bl-xl text-[10px] font-bold text-emerald-700 tracking-wide uppercase">
            Model 2: retail commission
          </div>
          <h4 className="font-display font-bold text-gray-800 text-base mb-1">
            Nail Polish Brand Affiliates
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Link each generated color palette automatically to matched real-world colors (e.g. OPI, Essie) on Amazon or Sephora. When users purchase matching colors to do it themselves, you receive an 8% commission check!
          </p>

          {/* Real Palette Match list rendered live */}
          <div className="space-y-2 bg-white/60 p-3 rounded-lg border border-emerald-100/30">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
              Active Affiliate Matches:
            </span>
            {getPolishMatches().map((polish, i) => (
              <div key={i} className="flex items-center justify-between text-[11px] border-b border-gray-100 last:border-0 pb-1.5 last:pb-0">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded border border-gray-300" style={{ backgroundColor: polish.hex }} />
                  <span className="text-gray-700 truncate font-medium max-w-[140px]">{polish.polishName}</span>
                </div>
                <a
                  href={polish.affiliateLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:underline flex items-center gap-0.5 text-[10px] font-mono"
                >
                  Buy {polish.commission} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Model 3: Salon Referral Leads */}
        <div className="p-5 rounded-xl bg-gradient-to-tr from-sky-50/50 to-blue-50/10 border border-sky-100/40 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 bg-sky-100/80 px-2.5 py-1 rounded-bl-xl text-[10px] font-bold text-sky-700 tracking-wide uppercase">
            Model 3: salon lead gen
          </div>
          <h4 className="font-display font-bold text-gray-800 text-base mb-1">
            Local Salon Partner Referral Bookings
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Establish partnerships with nail salons. Integrate a "Book with 10% Discount at Local Salon" button. The salon pays you $2 to $5 for sending a qualified customer who shows up with their exact recipe card. It is a win-win for everyone!
          </p>
          <div className="space-y-2 bg-white/50 p-2.5 rounded-lg border border-sky-100/30">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-semibold text-sky-700">Gloss &amp; Glam Studios (2.1 mi)</span>
              <span className="text-green-600 font-bold">Recommended Partner</span>
            </div>
            <button className="w-full py-1.5 bg-sky-600 text-white rounded-md text-[10px] font-bold tracking-wider hover:bg-sky-700 transition">
              📅 Send Design to Salon &amp; Book Appointment
            </button>
          </div>
        </div>

        {/* Model 4: Custom Press-On Nails Store */}
        <div className="p-5 rounded-xl bg-gradient-to-tr from-amber-50/50 to-orange-50/10 border border-amber-100/40 relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 bg-amber-100/80 px-2.5 py-1 rounded-bl-xl text-[10px] font-bold text-amber-700 tracking-wide uppercase">
            Model 4: e-commerce shop
          </div>
          <h4 className="font-display font-bold text-gray-800 text-base mb-1">
            Press-On Fulfillment Integration
          </h4>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Give users the option to turn their AI design into a custom gel press-on set shipped to their house for $29.99. You can use services like CustomGelNails or print-on-demand API partners. Your cost is $12, giving you a massive <strong>60% profit margin</strong>!
          </p>
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-800 font-bold block">Estimated Profit:</span>
              <span className="text-xs text-gray-700 font-mono">Retail: $29.99 / Net Profit: $17.99</span>
            </div>
            <div className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">
              High Margin
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE FOUNDER ESTIMATOR CALCULATOR */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-pink-500" />
          <h4 className="font-display font-bold text-gray-800 text-lg">
            Interactive Startup Profit Estimator
          </h4>
        </div>
        <p className="text-xs text-gray-500">
          Drag the sliders to estimate how much revenue your Nail Design app can generate in a month based on realistic traffic, premium conversion, affiliate polish sales, and salon bookings!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* SLIDERS COLUMN */}
          <div className="space-y-4">
            {/* Slider 1: Monthly Active Users */}
            <div>
              <label className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Monthly Active App Users</span>
                <span className="text-pink-600 font-mono font-bold">{monthlyUsers.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="500"
                value={monthlyUsers}
                onChange={(e) => setMonthlyUsers(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-[9px] text-gray-400">Total nail-lovers visiting your app monthly</span>
            </div>

            {/* Slider 2: Pro Conversion % */}
            <div>
              <label className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Premium Recipe Card Conversion</span>
                <span className="text-pink-600 font-mono font-bold">{proConversionRate}%</span>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                step="0.5"
                value={proConversionRate}
                onChange={(e) => setProConversionRate(parseFloat(e.target.value))}
                className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-[9px] text-gray-400">% of users who pay {proPrice} for a detailed salon PDF export</span>
            </div>

            {/* Slider 3: Affiliate Sales */}
            <div>
              <label className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Monthly Polish Bottles Sold</span>
                <span className="text-pink-600 font-mono font-bold">{affiliateSales} bottles</span>
              </label>
              <input
                type="range"
                min="50"
                max="2500"
                step="50"
                value={affiliateSales}
                onChange={(e) => setAffiliateSales(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-[9px] text-gray-400">Bottles purchased through Amazon/Sephora links ($0.80 commission per bottle)</span>
            </div>

            {/* Slider 4: Salon Leads booked */}
            <div>
              <label className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Monthly Partner Salon Bookings</span>
                <span className="text-pink-600 font-mono font-bold">{bookedLeads} bookings</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={bookedLeads}
                onChange={(e) => setBookedLeads(parseInt(e.target.value))}
                className="w-full accent-pink-500 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-[9px] text-gray-400">Users booking local appointments via your card ($5 lead fee)</span>
            </div>
          </div>

          {/* REPORT COLUMN */}
          <div className="bg-pink-50/50 rounded-xl p-5 border border-pink-100 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-pink-700 uppercase tracking-widest block mb-4">
                Monthly Financial Projection
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Pro PDF Recipe Subscriptions:</span>
                  <span className="font-mono font-semibold">${proMonthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Nail Brand Affiliate Comm.:</span>
                  <span className="font-mono font-semibold">${affiliateCommission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Salon Referral Leads Fee:</span>
                  <span className="font-mono font-semibold">${leadRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 border-t border-dashed border-pink-200 pt-2">
                  <span>Cloud Database Hosting Fees:</span>
                  <span className="font-mono text-red-600">-${cloudHostingCost}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-pink-200">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-pink-600 font-bold uppercase block">
                    Estimated Net Profit:
                  </span>
                  <span className="font-display text-2xl font-bold text-gray-800">
                    ${netProfit.toLocaleString()} <span className="text-xs font-sans text-gray-400 font-normal">/mo</span>
                  </span>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Margin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3">
        <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs text-emerald-800 space-y-1">
          <p className="font-semibold">Our Advice for Your Startup Journey:</p>
          <p className="leading-relaxed">
            As a beginner, <strong>start with Model 1 and Model 2</strong>! They require absolutely zero legal contracts or inventory. You can build this app, share it on TikTok/Pinterest, set up Amazon Affiliate links in 15 minutes, and add a premium download button. It is a highly satisfying way to start your first tech business!
          </p>
        </div>
      </div>
    </div>
  );
};
