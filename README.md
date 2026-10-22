# AquaStore

AquaStore, su arıtma ürünleri için katalog ve sipariş kaydı tutan bir HTTP API’dir. Marka, kategori, ürün, müşteri, adres ve sipariş işlemleri sunucu tarafında doğrulanır. Sipariş fiyatı veritabanındaki üründen alınır; stok düşümü sipariş kaydıyla aynı işlemde yapılır.

Kimlik doğrulama, ödeme ve vitrin bu çözümde yoktur. Müşteri kaydı, oturum açmış bir kullanıcı değildir. `frontend/aquastore-admin` yönetim panelinin de giriş koruması yoktur.

## Yönetim paneli

Panel React, TypeScript ve Vite ile `frontend/aquastore-admin` altındadır. API adresini `VITE_API_BASE_URL` belirler. Örnek değer `frontend/aquastore-admin/.env.example` dosyasındadır; yerel çalıştırmadan önce bunu `.env` olarak kopyalayın.

```bash
cd frontend/aquastore-admin
copy .env.example .env
npm install
npm run dev
```

Panel `http://localhost:5173` adresinde açılır. Geliştirme ortamındaki API, yalnızca `http://localhost:5173` ve `http://127.0.0.1:5173` origin’lerine CORS izni verir.

## Teknolojiler

- .NET 8
- ASP.NET Core
- Entity Framework Core 9 ve SQL Server
- MediatR ve FluentValidation
- Swagger (Swashbuckle)
- React, TypeScript, Vite ve Tailwind CSS (`frontend/aquastore-admin`)

Çalışan API projesi `AquaStore.API` projesidir. Panel ayrı bir Node uygulamasıdır.

## Yerel kurulum

1. .NET 8 SDK, Node.js ve SQL Server kurulu olmalıdır.
2. Bağımlılıkları geri yükleyip çözümü derleyin:

```bash
dotnet restore AquaStore.sln
dotnet build AquaStore.sln
```

## Bağlantı ayarı

API, `ConnectionStrings:DefaultConnection` değerini yapılandırmadan okur. Bu değer repoda tutulmaz.

Geliştirme ortamında User Secrets kullanın. Aşağıdaki değer yalnızca parolasız yerel Windows kimlik doğrulaması için bir örnektir; SQL kimlik doğrulaması kullanıyorsanız parolayı bu dosyalara yazmayın.

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=YOUR_DATABASE;Trusted_Connection=True;TrustServerCertificate=True" --project AquaStore.API
```

Aynı ayar ortam değişkeniyle de verilebilir:

```text
ConnectionStrings__DefaultConnection
```

`AquaStore.API` geliştirme ortamında User Secrets kimliğini proje dosyasından yükler. Bu makinede kullanılan yerel değer User Secrets deposuna taşındı.

## Migration uygulama

Bağlantı ayarı Development ortamında görünür olmalıdır. Mevcut migration dosyalarını silmeyin veya yeniden üretmeyin; veritabanını şu komutla güncelleyin:

```bash
dotnet ef database update --project AquaStore.DataAccess --startup-project AquaStore.API
```

`dotnet-ef` yüklü değilse:

```bash
dotnet tool install --global dotnet-ef
```

## Uygulamaları başlatma

İki uygulamayı ayrı terminallerde çalıştırın. Önce API:

```bash
dotnet run --project AquaStore.API --launch-profile http
```

API `http://localhost:5214`, Swagger `http://localhost:5214/swagger` adresindedir. HTTPS profili `https://localhost:7087` adresini de açar. Swagger yalnızca Development ortamında etkindir.

Sonra panel:

```bash
cd frontend/aquastore-admin
npm run dev
```

Panel `http://localhost:5173` adresindedir.
