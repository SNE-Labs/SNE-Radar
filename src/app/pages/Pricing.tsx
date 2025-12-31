import { Check, X, ShoppingCart, CreditCard } from 'lucide-react';
import { useState } from 'react';

export function Pricing() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleChoosePlan = (tier: any) => {
    setSelectedPlan(tier);
    setShowCheckout(true);
  };

  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for exploring SNE OS',
      features: [
        { name: 'Read-only access', included: true },
        { name: 'Preview mode', included: true },
        { name: 'Basic metrics', included: true },
        { name: 'Community support', included: true },
        { name: 'Trading features', included: false },
        { name: 'Priority support', included: false },
        { name: 'Advanced analytics', included: false },
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$99',
      period: 'per month',
      description: 'Full access for professionals',
      features: [
        { name: 'Full read/write access', included: true },
        { name: 'Trading features', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'API access', included: true },
        { name: 'Real-time alerts', included: true },
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
    },
    {
      name: 'Institution',
      price: 'Custom',
      period: 'contact us',
      description: 'Enterprise-grade infrastructure',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Dedicated nodes', included: true },
        { name: 'Custom SLAs', included: true },
        { name: 'White-label options', included: true },
        { name: 'On-premise deployment', included: true },
        { name: 'Dedicated support', included: true },
        { name: 'Volume discounts', included: true },
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="flex-1 px-8 py-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-3)' }}>Plans</p>
          <h1 className="text-4xl font-semibold mb-4" style={{ color: 'var(--text-1)' }}>Pricing</h1>
          <p className="text-lg" style={{ color: 'var(--text-2)' }}>
            Choose the plan that fits your needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="rounded-xl p-6"
              style={{
                backgroundColor: 'var(--bg-2)',
                borderWidth: tier.highlighted ? '2px' : '1px',
                borderColor: tier.highlighted ? 'var(--accent-orange)' : 'var(--stroke-1)',
                position: 'relative',
              }}
            >
              {tier.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ backgroundColor: 'var(--accent-orange)', color: '#FFFFFF' }}
                >
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-1)' }}>{tier.name}</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold" style={{ color: 'var(--text-1)' }}>{tier.price}</span>
                  <span className="text-sm" style={{ color: 'var(--text-3)' }}>/{tier.period}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>{tier.description}</p>
              </div>

              <button
                onClick={() => handleChoosePlan(tier)}
                className="w-full px-4 py-3 rounded-lg text-sm font-medium mb-6 transition-all hover:opacity-90"
                style={{
                  backgroundColor: tier.highlighted ? 'var(--accent-orange)' : 'var(--bg-3)',
                  color: tier.highlighted ? '#FFFFFF' : 'var(--text-1)',
                  borderWidth: tier.highlighted ? '0' : '1px',
                  borderColor: 'var(--stroke-1)',
                }}
              >
                {tier.cta}
              </button>

              <div className="space-y-3">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check size={16} style={{ color: 'var(--ok-green)', marginTop: '2px' }} />
                    ) : (
                      <X size={16} style={{ color: 'var(--text-3)', marginTop: '2px' }} />
                    )}
                    <span
                      className="text-sm"
                      style={{ color: feature.included ? 'var(--text-2)' : 'var(--text-3)' }}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div
          className="rounded-xl p-6"
          style={{ backgroundColor: 'var(--bg-2)', borderWidth: '1px', borderColor: 'var(--stroke-1)' }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-1)' }}>Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              { q: 'Can I upgrade or downgrade at any time?', a: 'Yes, you can change your plan at any time. Changes take effect immediately.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards and cryptocurrency payments.' },
              { q: 'Is there a free trial for Pro?', a: 'Yes, all new users get a 14-day free trial of Pro features.' },
            ].map((faq, index) => (
              <div key={index}>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-1)' }}>{faq.q}</p>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowCheckout(false)}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-md mx-4 rounded-lg"
            style={{ backgroundColor: 'var(--bg-1)', borderWidth: '1px', borderColor: 'var(--stroke-1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--stroke-1)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-orange)' }}>
                  <ShoppingCart size={20} style={{ color: '#FFFFFF' }} />
                </div>
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-1)' }}>Checkout</h2>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="p-2 rounded-lg hover:bg-[var(--bg-2)] transition-colors"
              >
                <X size={20} style={{ color: 'var(--text-2)' }} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Plan Summary */}
              <div className="mb-6">
                <h3 className="font-medium mb-2" style={{ color: 'var(--text-1)' }}>Plan Summary</h3>
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: 'var(--text-1)' }}>{selectedPlan.name} Plan</span>
                    <span className="text-lg font-bold" style={{ color: 'var(--accent-orange)' }}>{selectedPlan.price}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>{selectedPlan.description}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>{selectedPlan.period}</p>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mb-6">
                <h3 className="font-medium mb-3" style={{ color: 'var(--text-1)' }}>Payment Method</h3>
                <div className="space-y-2">
                  <button className="w-full p-3 rounded-lg border flex items-center gap-3 hover:bg-[var(--bg-2)] transition-colors"
                          style={{ borderColor: 'var(--stroke-1)', backgroundColor: 'var(--bg-2)' }}>
                    <CreditCard size={18} style={{ color: 'var(--text-2)' }} />
                    <span style={{ color: 'var(--text-1)' }}>Credit Card</span>
                  </button>
                  <button className="w-full p-3 rounded-lg border flex items-center gap-3 hover:bg-[var(--bg-2)] transition-colors"
                          style={{ borderColor: 'var(--stroke-1)', backgroundColor: 'var(--bg-2)' }}>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: 'var(--accent-orange)' }} />
                    <span style={{ color: 'var(--text-1)' }}>Cryptocurrency</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--bg-2)]"
                  style={{ backgroundColor: 'var(--bg-3)', color: 'var(--text-2)', borderWidth: '1px', borderColor: 'var(--stroke-1)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Thank you for choosing ${selectedPlan.name}! Payment integration coming soon.`);
                    setShowCheckout(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--accent-orange)', color: '#FFFFFF' }}
                >
                  Complete Purchase
                </button>
              </div>

              <p className="text-xs text-center mt-4" style={{ color: 'var(--text-3)' }}>
                By completing your purchase, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
