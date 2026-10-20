using AquaStore.Application.Orders.Commands;
using FluentValidation;

namespace AquaStore.Application.Orders.Validators
{
    public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
    {
        public CreateOrderCommandValidator()
        {
            RuleFor(x => x.CustomerId)
                .NotEmpty().WithMessage("CustomerId boş olamaz.");

            RuleFor(x => x.DeliveryAddressId)
                .NotEmpty().WithMessage("Teslimat adresi zorunludur.");

            RuleFor(x => x.InvoiceAddressId)
                .NotEmpty().WithMessage("Fatura adresi zorunludur.");

            RuleFor(x => x.OrderItems)
                .NotEmpty().WithMessage("Siparişte en az bir ürün olmalıdır.")
                .Must(items => items == null || items
                    .GroupBy(item => item.ProductId)
                    .All(group => group.Aggregate(0L, (sum, item) => sum + item.Quantity) <= int.MaxValue))
                .WithMessage("Ürün adedi çok büyük.");

            RuleForEach(x => x.OrderItems).ChildRules(orderItem =>
            {
                orderItem.RuleFor(i => i.ProductId)
                    .NotEmpty().WithMessage("Ürün seçilmelidir.");

                orderItem.RuleFor(i => i.Quantity)
                    .GreaterThan(0).WithMessage("Ürün adedi 0'dan büyük olmalıdır.");
            });

            //RuleFor(x => x.InvoiceType)
            //    .IsInEnum().WithMessage("Geçerli bir fatura tipi seçilmelidir.");

            //When(x => x.InvoiceType == Shared.Enums.InvoiceType.Personal, () =>
            //{
            //    RuleFor(x => x.TCKN)
            //        .NotEmpty().WithMessage("Bireysel faturalarda TCKN zorunludur.");
            //});

            //When(x => x.InvoiceType == Shared.Enums.InvoiceType.Corporate, () =>
            //{
            //    RuleFor(x => x.InvoiceRegistryNumber)
            //        .NotEmpty().WithMessage("Kurumsal faturalarda vergi numarası zorunludur.");
            //});
        }
    }
}