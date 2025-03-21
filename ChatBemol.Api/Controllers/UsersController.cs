using Microsoft.AspNetCore.Mvc;
using ChatBemol.Api.Data;
using ChatBemol.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace ChatBemol.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// Cria um novo usuário no sistema
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return BadRequest(new { message = "E-mail já cadastrado." });
            }

            if (await _context.Users.AnyAsync(u => u.CPF == user.CPF))
            {
                return BadRequest(new { message = "CPF já cadastrado." });
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
        }

        /// Obtém um usuário pelo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            return Ok(user);
        }

        /// Obtém um usuário pelo e-mail
        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return NotFound(new { message = "Usuário não encontrado." });
            }

            return Ok(user);
        }

        /// Endpoint de login para autenticar usuários
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.PasswordHash != request.Password)
            {
                return Unauthorized(new { message = "E-mail ou senha inválidos." });
            }

            // 🔹 Retorna os dados do usuário autenticado para exibição no perfil
            return Ok(new 
            { 
                message = "Login bem-sucedido!", 
                userId = user.Id,
                user.Name,
                user.LastName,
                user.Email,
                user.CPF,
                user.BirthDate,
                user.Gender,
                user.PhoneNumber,
                user.Cep,
                user.Street,
                user.Neighborhood,
                user.Number,
                user.City,
                user.State
            });
        }
    }

    /// Modelo para requisições de login
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}



