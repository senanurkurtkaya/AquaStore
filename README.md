# AquaStore

AquaStore, su arıtma ürünleri için katalog ve sipariş kaydı tutan bir HTTP API’dir. Marka, kategori, ürün, müşteri, adres ve sipariş işlemleri sunucu tarafında doğrulanır. Sipariş fiyatı veritabanındaki üründen alınır; stok düşümü sipariş kaydıyla aynı işlemde yapılır.

Kimlik doğrulama, ödeme ve vitrin bu çözümde yoktur. Müşteri kaydı, oturum açmış bir kullanıcı değildir.

## Teknolojiler

- .NET 8
- ASP.NET Core
- Entity Framework Core 9 ve SQL Server
- MediatR ve FluentValidation
- Swagger (Swashbuckle)

Çalışan API projesi `AquaStore.API` projesidir.

## Yerel kurulum

1. .NET 8 SDK ve SQL Server kurulu olmalıdır.
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

## API’yi başlatma

```bash
dotnet run --project AquaStore.API --launch-profile http
```

HTTP adresi `http://localhost:5214`, Swagger arayüzü `http://localhost:5214/swagger` adresindedir. HTTPS profili `https://localhost:7087` adresini de açar; Swagger yolu `/swagger` olarak kalır. Swagger yalnızca Development ortamında etkindir.
