# DDD English Quick Guide (10分钟速成)

## 🔑 Core Concepts & Key Terms

### 1. Domain-Driven Design (DDD)
**定义**: A software development approach focusing on modeling software to match business domain according to domain experts' input.

**Why DDD?**
- **Complex Systems**: Better than CRUD for complex business logic
- **Business-Tech Gap**: Bridges business understanding and technical implementation
- **Communication**: Same language for business & developers

**面试必备**: "DDD is a methodology, not a specific technology."

### 2. Ubiquitous Language (通用语言)
**定义**: Common language used by all team members (business + tech) based on domain model.

**核心作用**: Eliminates communication barriers, ensures consistent terminology.

**Good Example**:
```java
private OrderStatus status;  // Business term
private Money totalAmount;   // Value Object
```

### 3. Bounded Context (限界上下文)
**定义**: Explicit boundary within which a domain model exists. Each concept has specific meaning.

**关键**: Same concept can mean different things in different contexts.

**Anti-Corruption Layer**: Prevents concept pollution between contexts.



### 2.2 Bounded Context (限界上下文)

**英文定义**：
"A Bounded Context is an explicit boundary within which a domain model exists. Every domain concept within this boundary has a specific meaning."

**英文表达**：

- "Bounded Context defines the boundaries of your domain model"
- "Different contexts can have different representations of the same concept"
- "Anti-corruption Layer prevents concept pollution between contexts"

## 3. Strategic Design vs Tactical Design

### 3.1 Strategic Design (战略设计)

**核心活动英文表达**：

1. **Domain Identification**: Identify Core Domain, Supporting Subdomains, and Generic Subdomains
2. **Subdomain Division**: Identify business core competencies
3. **Bounded Context Definition**: Define boundaries for each subdomain
4. **Context Mapping**: Establish relationships between contexts

**英文问题回答**：

- **Core Domain**: Enterprise's core competency, requires major investment
- **Supporting Subdomain**: Supports core domain, important but not core
- **Generic Subdomain**: Common functionality that can be standardized or outsourced

### 3.2 Tactical Design (战术设计)

#### 3.2.1 Entity (实体)

**英文定义**：
"An Entity is an object that has a distinct identity that runs through time and different representations."

**英文特点**：

- Has business identity identifier (ID)
- State is mutable, but identity remains the same
- Encapsulates business behavior

#### 3.2.2 Value Object (值对象)

**英文定义**：
"A Value Object is an immutable object that describes some characteristic or attribute but carries no concept of identity."

**英文特点**：

- **Immutable**: Cannot be changed once created
- **Equality by value**: Two value objects are equal if their values are equal
- **Self-contained**: Can be used as entity attributes

#### 3.2.3 Aggregate (聚合)

**英文定义**：
"An Aggregate is a cluster of domain objects that can be treated as a single unit. An Aggregate forms a transactional consistency boundary."

**核心概念英文表达**：

- **Aggregate Root**: The single entry point to the aggregate
- **Aggregate Boundary**: Defines the scope of data consistency
- **Invariants**: Business rules that must always be true within the aggregate

#### 3.2.4 Domain Service (领域服务)

**英文定义**：
"A Domain Service is a stateless service that handles business logic that doesn't naturally fit within an Entity or Value Object."

#### 3.2.5 Domain Events (领域事件)

**英文定义**：
"Domain Events are events that represent something that happened in the domain that is of interest to domain experts."

## 4. DDD Layered Architecture

### 4.1 Four-Layer Architecture Details

#### 4.1.1 Presentation Layer (表现层)

**英文职责**：

- Handle user requests and responses
- Data Transfer Object (DTO) conversion
- Request routing and validation

#### 4.1.2 Application Layer (应用层)

**英文职责**：

- Orchestrate domain layer to fulfill business use cases
- Handle cross-domain business processes
- Manage transactions and security control

#### 4.1.3 Domain Layer (领域层)

**英文职责**：

- Core business logic and rules
- Domain model implementation
- Independent of any external frameworks

#### 4.1.4 Infrastructure Layer (基础设施层)

**英文职责**：

- Provide technical implementation details
- Database access, external service calls
- Framework and third-party library integration
