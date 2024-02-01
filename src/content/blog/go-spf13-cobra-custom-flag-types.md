---
title: 'Go spf13/Cobra custom flag types'
description: 'Cobra allows you to define custom value types to be used as flags through the `pflag.(*FlagSet).Var()` method (from the pflag package, that is used by Cobra). You have to make a new type that implements the pflag.Value'
pubDate: '2021-12-31'
heroImage: /blog/go-spf13-cobra-custom-flag-types/cobra-cover.png
tags:
  - cli
  - cobra
  - go
  - golang
  - guide
---

Cobra allows you to define custom value types to be used as flags through the [`pflag.(*FlagSet).Var()`](https://pkg.go.dev/github.com/spf13/pflag?utm_source=godoc#FlagSet.Var) method (from the <https://github.com/spf13/pflag> package, that is used by Cobra). You have to make a new type that implements the [`pflag.Value`](https://pkg.go.dev/github.com/spf13/pflag?utm_source=godoc#Value) interface:<!--more-->

```go
type Value interface {
	String() string
	Set(string) error
	Type() string
}
```

Example type definition:

```go
type myEnum string

const (
	myEnumFoo myEnum = "foo"
	myEnumBar myEnum = "bar"
	myEnumMoo myEnum = "moo"
)

// String is used both by fmt.Print and by Cobra in help text
func (e *myEnum) String() string {
	return string(*e)
}

// Set must have pointer receiver so it doesn't change the value of a copy
func (e *myEnum) Set(v string) error {
	switch v {
	case "foo", "bar", "moo":
		*e = myEnum(v)
		return nil
	default:
		return errors.New(`must be one of "foo", "bar", or "moo"`)
	}
}

// Type is only used in help text
func (e *myEnum) Type() string {
	return "myEnum"
}
```

Example registration:

```go
func init() {
	var flagMyEnum = myEnumFoo

	var myCmd = &cobra.Command{
		Use:   "mycmd",
		Short: "A brief description of your command",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("myenum value:", flagMyEnum)
		},
	}

	rootCmd.AddCommand(myCmd)

	myCmd.Flags().Var(&flagMyEnum, "myenum", `my custom enum. allowed: "foo", "bar", "moo"`)
}
```

Example usage: (notice the first line in the console output below)

```console
$ go run . mycmd --myenum raz
Error: invalid argument "raz" for "--myenum" flag: must be one of "foo", "bar", or "moo"
Usage:
  main mycmd [flags]

Flags:
  -h, --help            help for mycmd
      --myenum myEnum   my custom enum. allowed: "foo", "bar", "moo" (default foo)

exit status 1
```

```console
$ go run . mycmd --myenum bar
myenum value: bar
```

## Completions

To add autocompletion to this, the somewhat hidden documentation page [cobra/shell_completions.md#completions-for-flags](https://github.com/spf13/cobra/blob/v1.8.0/site/content/completions/_index.md#completions-for-flags) is at great assistance. For our example, you would add something like this:

```go
func init() {
	// ...

	myCmd.Flags().Var(&flagMyEnum, "myenum", `my custom enum. allowed: "foo", "bar", "moo"`)

	myCmd.RegisterFlagCompletionFunc("myenum", myEnumCompletion)
}

// myEnumCompletion should probably live next to the myEnum definition
func myEnumCompletion(cmd *cobra.Command, args []string, toComplete string) ([]string, cobra.ShellCompDirective) {
	return []string{
		"foo\thelp text for foo",
		"bar\thelp text for bar",
		"moo\thelp text for moo",
	}, cobra.ShellCompDirectiveDefault
}
```

Example usage:

```console
$ go build -o main .
```

```console
$ source <(main completion bash)
```

```console
$ main mycmd --myenum <TAB><TAB>
bar  (help text for bar)
foo  (help text for foo)
moo  (help text for moo)
```
