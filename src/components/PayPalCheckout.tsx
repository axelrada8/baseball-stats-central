
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PayPalCheckoutProps {
  planType: 'premium';
  billingCycle: 'monthly' | 'yearly';
  onBack: () => void;
  onSuccess: () => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalCheckout({ planType, billingCycle, onBack, onSuccess }: PayPalCheckoutProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const amount = billingCycle === 'monthly' ? '3.99' : '30.00';
  const currency = 'USD';

  useEffect(() => {
    // Cargar el SDK de PayPal
    if (!window.paypal) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=sb&currency=USD&intent=subscription';
      script.onload = () => {
        setPaypalLoaded(true);
        initializePayPal();
      };
      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
      initializePayPal();
    }
  }, []);

  const initializePayPal = () => {
    if (!window.paypal || !paypalRef.current || !user) return;

    setLoading(true);

    window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'subscribe'
      },
      createSubscription: async (data: any, actions: any) => {
        // En producción, aquí crearías la suscripción en PayPal
        // Por ahora, simularemos el proceso
        return actions.subscription.create({
          plan_id: billingCycle === 'monthly' ? 'P-MONTHLY-PLAN-ID' : 'P-YEARLY-PLAN-ID',
          application_context: {
            brand_name: 'Baseball Stats App',
            locale: 'es-ES',
            shipping_preference: 'NO_SHIPPING',
            user_action: 'SUBSCRIBE_NOW',
            payment_method: {
              payer_selected: 'PAYPAL',
              payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
            },
            return_url: `${window.location.origin}/dashboard`,
            cancel_url: `${window.location.origin}/plans`
          }
        });
      },
      onApprove: async (data: any, actions: any) => {
        try {
          // Actualizar la suscripción en la base de datos
          const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .update({
              plan_type: 'premium',
              status: 'active',
              paypal_subscription_id: data.subscriptionID,
              amount: parseFloat(amount),
              currency: currency,
              end_date: billingCycle === 'monthly' 
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('user_id', user.id);

          if (subscriptionError) throw subscriptionError;

          // Registrar el pago
          const { error: paymentError } = await supabase
            .from('payments')
            .insert({
              user_id: user.id,
              subscription_id: data.subscriptionID,
              paypal_payment_id: data.orderID || data.subscriptionID,
              amount: parseFloat(amount),
              currency: currency,
              status: 'completed',
              payment_method: 'paypal'
            });

          if (paymentError) console.error('Error registering payment:', paymentError);

          toast({
            title: "¡Pago exitoso!",
            description: `Tu suscripción ${billingCycle === 'monthly' ? 'mensual' : 'anual'} ha sido activada.`,
          });

          onSuccess();
        } catch (error) {
          console.error('Error processing payment:', error);
          toast({
            variant: "destructive",
            title: "Error en el pago",
            description: "No se pudo procesar tu pago. Inténtalo de nuevo.",
          });
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        toast({
          variant: "destructive",
          title: "Error de PayPal",
          description: "Ocurrió un error con PayPal. Inténtalo de nuevo.",
        });
      },
      onCancel: () => {
        toast({
          title: "Pago cancelado",
          description: "Has cancelado el proceso de pago.",
        });
      }
    }).render(paypalRef.current).then(() => {
      setLoading(false);
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a planes
      </Button>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <CreditCard className="w-6 h-6" />
            Checkout - Plan Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Resumen del pedido:</h3>
            <div className="flex justify-between items-center">
              <span>Plan Premium ({billingCycle === 'monthly' ? 'Mensual' : 'Anual'})</span>
              <span className="font-bold">${amount} USD</span>
            </div>
            {billingCycle === 'yearly' && (
              <div className="text-sm text-green-600 mt-1">
                ¡Ahorras $17.88 al año!
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-medium mb-2">Métodos de pago disponibles:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                PayPal y Tarjetas de Crédito/Débito
              </p>
            </div>

            <div className="border rounded-lg p-4">
              {loading && paypalLoaded && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Cargando PayPal...</p>
                </div>
              )}
              {!paypalLoaded && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Cargando sistema de pagos...</p>
                </div>
              )}
              <div ref={paypalRef}></div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              <p>
                Al completar tu compra, aceptas nuestros términos de servicio.
                Tu suscripción se renovará automáticamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
