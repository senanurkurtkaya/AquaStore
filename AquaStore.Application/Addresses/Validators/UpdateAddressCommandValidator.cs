using AquaStore.Application.Addresses.Commands;
using FluentValidation;

namespace AquaStore.Application.Addresses.Validators
{
    public class UpdateAddressCommandValidator : AbstractValidator<UpdateAddressCommand>
    {
        public UpdateAddressCommandValidator()
        {
            RuleFor(x => x.CustomerId)
                .NotEmpty().WithMessage("Müşteri kimliği boş olamaz.");

            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Adres kimliği boş olamaz.");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Adres başlığı boş olamaz.")
                .MaximumLength(100).WithMessage("Adres başlığı en fazla 100 karakter olabilir.");

            RuleFor(x => x.Country)
                .NotEmpty().WithMessage("Ülke boş olamaz.")
                .MaximumLength(100).WithMessage("Ülke en fazla 100 karakter olabilir.");

            RuleFor(x => x.City)
                .NotEmpty().WithMessage("İl boş olamaz.")
                .MaximumLength(100).WithMessage("İl en fazla 100 karakter olabilir.");

            RuleFor(x => x.District)
                .NotEmpty().WithMessage("İlçe boş olamaz.")
                .MaximumLength(100).WithMessage("İlçe en fazla 100 karakter olabilir.");

            RuleFor(x => x.Street)
                .NotEmpty().WithMessage("Sokak boş olamaz.")
                .MaximumLength(250).WithMessage("Sokak en fazla 250 karakter olabilir.");

            RuleFor(x => x.PostalCode)
                .NotEmpty().WithMessage("Posta kodu boş olamaz.")
                .MaximumLength(20).WithMessage("Posta kodu en fazla 20 karakter olabilir.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Adres açıklaması boş olamaz.")
                .MaximumLength(500).WithMessage("Adres açıklaması en fazla 500 karakter olabilir.");
        }
    }
}
