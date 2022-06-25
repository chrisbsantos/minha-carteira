export function formatCurrency(current: number): string {
    return current.toLocaleString('pt-br', {
            style: 'currency', 
            currency: 'BRL',
            minimumFractionDigits: 2
        });
}
 
export function formatDate(date: string): string {
    const vdata = new Date(date)   
    return Intl.DateTimeFormat(
        'pt-BR', {     
            day: '2-digit',     
            month: '2-digit',     
            year: 'numeric'   
        }).format(vdata)
}