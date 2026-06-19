import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { billingData } from '../data';

export const BillingView = () => (
  <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-end">
      <div>
        <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">Financial Operations</p>
        <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Billing & Invoices</h2>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="font-bold text-xs h-9">Download All</Button>
        <Button variant="gold" size="sm" className="font-bold text-xs h-9">Create Invoice</Button>
      </div>
    </div>

    <Card className="border-none shadow-sm overflow-hidden bg-white">
      <CardContent className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-sand/20 border-b border-brand-sand/30">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Invoice ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Guest</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Date</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Method</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand/30">
            {billingData.map((row) => (
              <tr key={row.id} className="hover:bg-brand-sand/10 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-emerald">{row.id}</td>
                <td className="px-6 py-4 text-sm font-semibold">{row.guest}</td>
                <td className="px-6 py-4 text-sm font-bold text-brand-gold">{row.amount}</td>
                <td className="px-6 py-4 text-sm text-brand-charcoal/60">{row.date}</td>
                <td className="px-6 py-4 text-sm text-brand-charcoal/60">{row.method}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter ${
                    row.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                    row.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-brand-emerald font-bold text-[10px] uppercase">View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  </div>
);

