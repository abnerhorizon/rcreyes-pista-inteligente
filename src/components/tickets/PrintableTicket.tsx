import { QRCodeSVG } from 'qrcode.react';
import { Ticket } from '@/types/database';

interface PrintableTicketProps {
  ticket: Ticket;
  personNumber?: number;
  totalPersons: number;
  isGroupTicket?: boolean;
}

export function PrintableTicket({ ticket, personNumber, totalPersons, isGroupTicket = false }: PrintableTicketProps) {
  const entryTime = new Date(ticket.hora_entrada).toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short',
  });

  return (
    <div className="print-ticket">
      {/* Header with logo area */}
      <div className="print-ticket-header">
        <div className="print-ticket-logo">RC</div>
        <div className="print-ticket-brand">
          <h1>RCREYES</h1>
          <span>Pista de Radio Control</span>
        </div>
      </div>
      
      <div className="print-ticket-divider"></div>
      
      {/* Ticket code prominent */}
      <div className="print-ticket-code-section">
        <span className="print-ticket-label">TICKET DE ENTRADA</span>
        <span className="print-ticket-code">{ticket.codigo}</span>
      </div>
      
      <div className="print-ticket-divider"></div>
      
      {/* QR Code centered */}
      <div className="print-ticket-qr">
        <QRCodeSVG
          value={`RCREYES:${ticket.codigo}`}
          size={90}
          level="M"
        />
      </div>
      
      <div className="print-ticket-divider-dots"></div>
      
      {/* Client and entry info */}
      <div className="print-ticket-info">
        <div className="print-ticket-row">
          <span className="print-ticket-label-sm">Cliente</span>
          <span className="print-ticket-value">{ticket.cliente?.nombre}</span>
        </div>
        <div className="print-ticket-row">
          <span className="print-ticket-label-sm">Entrada</span>
          <span className="print-ticket-value">{entryTime}</span>
        </div>
      </div>
      
      {/* Person badge */}
      <div className="print-ticket-person-badge">
        {isGroupTicket ? (
          <>
            <span className="print-ticket-person-icon">👥</span>
            <span>{totalPersons} persona{totalPersons > 1 ? 's' : ''}</span>
          </>
        ) : (
          <>
            <span className="print-ticket-person-number">{personNumber}</span>
            <span>de {totalPersons}</span>
          </>
        )}
      </div>
      
      <div className="print-ticket-divider"></div>
      
      {/* Footer */}
      <div className="print-ticket-footer">
        <p>Escanea el QR al salir</p>
        <p className="print-ticket-thanks">¡Gracias por tu visita!</p>
      </div>
    </div>
  );
}

interface PrintableTicketsContainerProps {
  ticket: Ticket;
  onClose: () => void;
}

export function PrintableTicketsContainer({ ticket, onClose }: PrintableTicketsContainerProps) {
  const handlePrint = () => {
    window.print();
  };

  const isGroupTicket = !ticket.imprimir_individual;
  const tickets = isGroupTicket 
    ? [1]
    : Array.from({ length: ticket.personas }, (_, i) => i + 1);

  return (
    <div className="print-container">
      {/* Print controls - hidden when printing */}
      <div className="print-controls no-print">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            {isGroupTicket 
              ? `1 ticket grupal (${ticket.personas} personas)` 
              : `${ticket.personas} ticket${ticket.personas > 1 ? 's' : ''} individual${ticket.personas > 1 ? 'es' : ''}`
            }
          </p>
        </div>
        <button onClick={handlePrint} className="print-btn">
          Imprimir {isGroupTicket ? '1 ticket' : `${ticket.personas} ticket${ticket.personas > 1 ? 's' : ''}`}
        </button>
        <button onClick={onClose} className="print-btn-secondary">
          Cerrar
        </button>
      </div>

      {/* Tickets to print */}
      <div className="print-tickets-grid">
        {tickets.map((num) => (
          <PrintableTicket
            key={num}
            ticket={ticket}
            personNumber={isGroupTicket ? undefined : num}
            totalPersons={ticket.personas}
            isGroupTicket={isGroupTicket}
          />
        ))}
      </div>

      <style>{`
        .print-container {
          padding: 20px;
          background: #f5f5f5;
          min-height: 100vh;
        }
        
        .print-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .print-btn {
          padding: 12px 32px;
          background: #e31837;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        
        .print-btn:hover {
          background: #c41530;
        }
        
        .print-btn-secondary {
          padding: 10px 24px;
          background: transparent;
          color: #666;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }
        
        .print-btn-secondary:hover {
          background: #eee;
        }
        
        .print-tickets-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        
        /* Ticket styles optimized for 58mm thermal printer */
        .print-ticket {
          width: 48mm;
          padding: 3mm;
          border: 1px dashed #ccc;
          background: white;
          text-align: center;
          font-family: 'Arial Narrow', Arial, sans-serif;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .print-ticket-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 2mm;
        }
        
        .print-ticket-logo {
          width: 24px;
          height: 24px;
          background: #e31837;
          color: white;
          font-weight: bold;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        
        .print-ticket-brand h1 {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1;
        }
        
        .print-ticket-brand span {
          font-size: 7px;
          color: #666;
          letter-spacing: 0.5px;
        }
        
        .print-ticket-divider {
          border-top: 1px dashed #ccc;
          margin: 2mm 0;
        }
        
        .print-ticket-divider-dots {
          border-top: 1px dotted #aaa;
          margin: 2mm 0;
        }
        
        .print-ticket-code-section {
          padding: 2mm 0;
        }
        
        .print-ticket-label {
          display: block;
          font-size: 7px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1mm;
        }
        
        .print-ticket-code {
          display: block;
          font-size: 16px;
          font-weight: bold;
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }
        
        .print-ticket-qr {
          padding: 2mm 0;
          display: flex;
          justify-content: center;
        }
        
        .print-ticket-info {
          text-align: left;
          padding: 1mm 2mm;
        }
        
        .print-ticket-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin: 1mm 0;
          font-size: 9px;
        }
        
        .print-ticket-label-sm {
          color: #666;
          font-size: 8px;
        }
        
        .print-ticket-value {
          font-weight: 600;
          text-align: right;
          max-width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .print-ticket-person-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 2mm 3mm;
          margin: 2mm 0;
          font-size: 11px;
          font-weight: 600;
        }
        
        .print-ticket-person-number {
          background: #e31837;
          color: white;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
        }
        
        .print-ticket-person-icon {
          font-size: 14px;
        }
        
        .print-ticket-footer {
          font-size: 8px;
          color: #666;
          padding-top: 1mm;
        }
        
        .print-ticket-footer p {
          margin: 1mm 0;
        }
        
        .print-ticket-thanks {
          font-weight: 600;
          color: #333;
        }
        
        /* Print media styles for 58mm thermal */
        @media print {
          @page {
            size: 58mm auto;
            margin: 0;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-container {
            padding: 0;
            background: white;
            min-height: auto;
          }
          
          .print-tickets-grid {
            display: block;
          }
          
          .print-ticket {
            width: 48mm;
            border: none;
            box-shadow: none;
            margin: 0 auto;
            padding: 2mm 3mm 4mm;
            page-break-after: always;
          }
          
          .print-ticket:last-child {
            page-break-after: avoid;
          }
          
          .print-ticket-logo {
            background: #000 !important;
            color: white !important;
          }
          
          .print-ticket-person-number {
            background: #000 !important;
            color: white !important;
          }
        }
      `}</style>
    </div>
  );
}
