# Common Reason

[![Discord](https://img.shields.io/discord/586902457053872148.svg)](https://discord.gg/DZbg4rZ)

**Common Reason** is a blockchain platform with smart contracts based
on logic programming (Datalog) and relational database.

## Motivation

Nowadays, most smart contract platforms out in the wild treat smart
contracts as "programs", storage as "file systems". However, by
storing contracts as binary blob on chain, it becomes difficult to
reason about the internals of the contracts or to derive additional
functionality out of it.

**Common Reason** aims at trying out a different approach. Here, we
treat the whole storage as a relational database, with a reduced logic
programming engine, Datalog, built on top of it. Actions, which are
normal WebAssembly programs, operates on and modify the predicates in
the relational database, to update the state.

## Basic Information

If you are wondering, we're still in the *Design Phase* of **Common
Reason** blockchain. This is a hobby project, so things may take some
time to take off. In the mean time, we welcome you to join our
[Discord](https://discord.gg/VbdWT6c), or leave a comment on our
Github issues, if you have any questions regarding this blockchain.

The blockchain is most likely to be launched with Proof of Work
consensus without pre-mine.

## Accounts and Smart Contracts

**Common Reason** blockchain uses an account-based state model. All
accounts and smart contracts in the blockchain are called
**cells**. Each cell contains the following information.

### Identifier

Atom identifier that can be used in logic predicates. For example:

```
id Kitty;
```

Defines a kitty identifier. Besides user-defined identifiers, there
are two system-defined identifiers `User`, which represents either an
account or a smart contract, and `uint`, which represents unsigned
integer.

### Fact Relations

Relations define semantics of the data.

```
fact owner(kitty: Kitty, user: User);
fact parent(parent: Kitty, child: Kitty);
```

This declares the `owner` and `parent` relationship. Using this, facts
can be defined as the actual data stored in each cell. For example,
below is a fact.

```
owner(K1, U1);
owner(K2, U1);
parent(K1, K2);
```

It states that user `U1` is an owner of `K1` and `K2`, and `K1` is a
parent of `K2`.

### Rule Relations

Rules are built on top of facts. For example, one can say:

```
rule ancestor(a: Kitty, b: Kitty);
ancestor(a, b) <- parent(a, b);
ancestor(a, b), c <- parent(a, c), ancestor(c, b);
```

This declares the rule `ancestor`. Ancestors are parents, or parents
of parents.

#### Procedural Rules

A particular clause of the body of a rule can be a WebAssembly
binary. This allows numerical operations or negation to be
defined. Note that the parameter rules must follow Datalog definition.

### Actions

Actions are used to change facts of a cell. They are callable, if all
the predicates defined are satisfied. To resolve the predicates, the
transaction is expected to provide the proof that predicates are
satisfied. This avoids logic engine in state transition function.

Requirements of action combining rules are written directly in
predicates. The user who make the transaction is expected to provide
all actions required in one go.

The first parameter of an action is always the caller (as defined in
the transaction). The body of an action is a WebAssembly binary blob.

```
extern coin = <coin operation address>;

action sell(caller, receiver: User, kitty: Kitty) where
  owner(caller, kitty),
  coin.transfer(receiver, caller, 100)
=>
  -owner(caller, kitty),
  +owner(receiver, kitty);
```

The above states that owner of a kitty can sell the kitty to others,
given that there must be, at the same time, a transfer of 100 coin
from receiver to caller.

#### Multi-party Actions

Note that the above example given is a multi-party action. The
`caller` is affected in that his/her kitty is being transferred, and
the receiver is affected in that his/her coin needs to be transferred
to the caller. As a result, the transaction will require
multi-signatures.
