using AquaStore.Application.Brands.Commands;
using FluentValidation;

namespace AquaStore.Application.Brands.Validators
{
    public class UpdateBrandCommandValidator : AbstractValidator<UpdateBrandCommand>
    {
        public UpdateBrandCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty().WithMessage("Marka kimliği boş olamaz.");

            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Marka adı boş olamaz.")
                .MaximumLength(100).WithMessage("Marka adı en fazla 100 karakter olabilir.");

            RuleFor(x => x.Description)
                .MaximumLength(500).WithMessage("Marka açıklaması en fazla 500 karakter olabilir.");
        }
    }
}
