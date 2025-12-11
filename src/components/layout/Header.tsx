import { LogOut, User, Menu, Flag, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
}

const roleConfig: Record<string, { label: string; color: string }> = {
  operador: { label: 'Operador', color: 'bg-muted text-muted-foreground' },
  supervisor: { label: 'Supervisor', color: 'bg-warning/20 text-warning' },
  admin: { label: 'Admin', color: 'bg-primary/20 text-primary' },
  root: { label: 'Root', color: 'bg-destructive/20 text-destructive' },
};

export function Header({ onMenuClick }: HeaderProps) {
  const { profile, role, signOut } = useAuth();

  const roleInfo = roleConfig[role || ''] || roleConfig.operador;

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden touch-target"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-display font-bold text-lg shadow-lg shadow-primary/25">
              RC
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-card" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold tracking-wide leading-none">RCReyes</h1>
              <p className="text-xs text-muted-foreground">Control de Pistas RC</p>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="touch-target gap-3 pr-2">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-none">{profile?.nombre || 'Usuario'}</p>
                <Badge variant="secondary" className={cn("mt-1 text-[10px] px-1.5 py-0", roleInfo.color)}>
                  <Shield className="h-2.5 w-2.5 mr-0.5" />
                  {roleInfo.label}
                </Badge>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary border-2 border-border">
                <User className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-popover z-50">
            <DropdownMenuLabel className="font-display">Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-muted-foreground text-sm">
              {profile?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-destructive font-medium">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
