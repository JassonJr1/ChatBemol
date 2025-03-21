using Microsoft.EntityFrameworkCore;
using ChatBemol.Api.Models;

namespace ChatBemol.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext() { }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=localhost;Database=ChatBemol;User Id=seu_usuario;Password=sua_senha;");
            }
        }
    }
}
