import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, AlertCircle, QrCode, Car, Timer, Flag, Gauge, Users, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { TicketCard } from '@/components/tickets/TicketCard';
import { QRScanner } from '@/components/qr/QRScanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Ticket, EstadoTicket } from '@/types/database';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const fetchTickets = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          cliente:clientes(*),
          tarifa_hora:tarifas_hora(*)
        `)
        .in('estado', ['activo', 'pausado'])
        .order('hora_entrada', { ascending: false });

      if (error) throw error;
      
      setTickets((data || []) as unknown as Ticket[]);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Error al cargar los tickets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('tickets-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tickets',
        },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePause = async (ticketId: string) => {
    try {
      const { error: pauseError } = await supabase
        .from('pausas_ticket')
        .insert({ ticket_id: ticketId });

      if (pauseError) throw pauseError;

      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ estado: 'pausado' as EstadoTicket })
        .eq('id', ticketId);

      if (ticketError) throw ticketError;

      toast.success('Ticket pausado');
      fetchTickets();
    } catch (error) {
      console.error('Error pausing ticket:', error);
      toast.error('Error al pausar el ticket');
    }
  };

  const handleResume = async (ticketId: string) => {
    try {
      const { error: pauseError } = await supabase
        .from('pausas_ticket')
        .update({ fin_pausa: new Date().toISOString() })
        .eq('ticket_id', ticketId)
        .is('fin_pausa', null);

      if (pauseError) throw pauseError;

      const { error: ticketError } = await supabase
        .from('tickets')
        .update({ estado: 'activo' as EstadoTicket })
        .eq('id', ticketId);

      if (ticketError) throw ticketError;

      toast.success('Ticket reanudado');
      fetchTickets();
    } catch (error) {
      console.error('Error resuming ticket:', error);
      toast.error('Error al reanudar el ticket');
    }
  };

  const handleQRScan = async (code: string) => {
    setShowScanner(false);
    
    const { data: ticket, error } = await supabase
      .from('tickets')
      .select('id, estado')
      .eq('codigo', code)
      .maybeSingle();

    if (error || !ticket) {
      toast.error('Ticket no encontrado');
      return;
    }

    if (ticket.estado === 'cerrado' || ticket.estado === 'cancelado') {
      toast.error('Este ticket ya está cerrado');
      return;
    }

    navigate(`/cobro/${ticket.id}`);
  };

  const activeTickets = tickets.filter(t => t.estado === 'activo');
  const pausedTickets = tickets.filter(t => t.estado === 'pausado');
  const totalPersonas = tickets.reduce((sum, t) => sum + (t.personas || 1), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-secondary to-secondary/80 p-6 text-secondary-foreground">
          {/* Racing stripes decoration */}
          <div className="absolute top-0 right-0 w-32 h-full opacity-10">
            <div className="absolute top-0 right-0 w-4 h-full bg-primary transform skew-x-12" />
            <div className="absolute top-0 right-8 w-4 h-full bg-primary transform skew-x-12" />
            <div className="absolute top-0 right-16 w-4 h-full bg-primary transform skew-x-12" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary">
                <Flag className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold tracking-wide">
                  RCReyes
                </h1>
                <p className="text-secondary-foreground/70 text-sm">
                  ¡Hola, {profile?.nombre || 'Operador'}! Bienvenido a la pista.
                </p>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-success/20">
                  <Car className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{activeTickets.length}</p>
                  <p className="text-xs text-secondary-foreground/70">En pista</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-warning/20">
                  <Timer className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{pausedTickets.length}</p>
                  <p className="text-xs text-secondary-foreground/70">Pausados</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold">{totalPersonas}</p>
                  <p className="text-xs text-secondary-foreground/70">Personas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate('/nuevo-ticket')}
            className="touch-button gap-2 flex-1 sm:flex-none bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
          >
            <Plus className="h-5 w-5" />
            <span className="font-display tracking-wide">Nuevo Ticket</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowScanner(true)}
            className="touch-button gap-2 flex-1 sm:flex-none border-2"
          >
            <QrCode className="h-5 w-5" />
            <span className="font-display tracking-wide">Escanear QR</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fetchTickets(true)}
            disabled={refreshing}
            className="touch-target"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* QR Scanner Dialog */}
        <Dialog open={showScanner} onOpenChange={setShowScanner}>
          <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none">
            <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />
          </DialogContent>
        </Dialog>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
              <p className="text-muted-foreground font-display">Cargando pista...</p>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <Card className="border-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Gauge className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mb-2 text-xl font-display font-bold">Pista Vacía</h2>
              <p className="mb-6 text-center text-muted-foreground max-w-sm">
                No hay carreras activas en este momento. ¡Registra un nuevo cliente para empezar!
              </p>
              <Button 
                onClick={() => navigate('/nuevo-ticket')} 
                className="touch-button gap-2 shadow-lg shadow-primary/25"
              >
                <Zap className="h-5 w-5" />
                <span className="font-display tracking-wide">¡Arrancar Carrera!</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active tickets */}
            {activeTickets.length > 0 && (
              <div className="animate-slide-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
                    </span>
                    <span className="font-display font-semibold text-success">
                      En Pista ({activeTickets.length})
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {activeTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onPause={handlePause}
                      onResume={handleResume}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Paused tickets */}
            {pausedTickets.length > 0 && (
              <div className="animate-slide-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20">
                    <Timer className="h-4 w-4 text-warning" />
                    <span className="font-display font-semibold text-warning">
                      Pit Stop ({pausedTickets.length})
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pausedTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      onPause={handlePause}
                      onResume={handleResume}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
