using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AquaStore.Shared.Enums.Enums
{
    public enum OrderState
    {
        Pending = 1,      // Sipariş alındı, işlem bekliyor
        Processing = 2,   // Hazırlanıyor / işleniyor
        Shipped = 3,      // Kargoya verildi
        Completed = 4,    // Teslim edildi
        Cancelled = 5     // İptal edildi
    }
}
